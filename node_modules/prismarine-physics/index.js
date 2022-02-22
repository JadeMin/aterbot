const Vec3 = require('vec3').Vec3
const AABB = require('./lib/aabb')
const math = require('./lib/math')
const features = require('./lib/features')
const attribute = require('./lib/attribute')

function makeSupportFeature (mcData) {
  return feature => features.some(({ name, versions }) => name === feature && versions.includes(mcData.version.majorVersion))
}

function Physics (mcData, world) {
  const supportFeature = makeSupportFeature(mcData)
  const blocksByName = mcData.blocksByName

  // Block Slipperiness
  // https://www.mcpk.wiki/w/index.php?title=Slipperiness
  const blockSlipperiness = {}
  const slimeBlockId = blocksByName.slime_block ? blocksByName.slime_block.id : blocksByName.slime.id
  blockSlipperiness[slimeBlockId] = 0.8
  blockSlipperiness[blocksByName.ice.id] = 0.98
  blockSlipperiness[blocksByName.packed_ice.id] = 0.98
  if (blocksByName.frosted_ice) { // 1.9+
    blockSlipperiness[blocksByName.frosted_ice.id] = 0.98
  }
  if (blocksByName.blue_ice) { // 1.13+
    blockSlipperiness[blocksByName.blue_ice.id] = 0.989
  }

  // Block ids
  const soulsandId = blocksByName.soul_sand.id
  const honeyblockId = blocksByName.honey_block ? blocksByName.honey_block.id : -1 // 1.15+
  const webId = blocksByName.cobweb ? blocksByName.cobweb.id : blocksByName.web.id
  const waterId = blocksByName.water.id
  const lavaId = blocksByName.lava.id
  const ladderId = blocksByName.ladder.id
  const vineId = blocksByName.vine.id
  const waterLike = new Set()
  if (blocksByName.seagrass) waterLike.add(blocksByName.seagrass.id) // 1.13+
  if (blocksByName.tall_seagrass) waterLike.add(blocksByName.tall_seagrass.id) // 1.13+
  if (blocksByName.kelp) waterLike.add(blocksByName.kelp.id) // 1.13+
  const bubblecolumnId = blocksByName.bubble_column ? blocksByName.bubble_column.id : -1 // 1.13+
  if (blocksByName.bubble_column) waterLike.add(bubblecolumnId)

  const physics = {
    gravity: 0.08, // blocks/tick^2 https://minecraft.gamepedia.com/Entity#Motion_of_entities
    airdrag: Math.fround(1 - 0.02), // actually (1 - drag)
    yawSpeed: 3.0,
    pitchSpeed: 3.0,
    playerSpeed: 0.1,
    sprintSpeed: 0.3,
    sneakSpeed: 0.3,
    stepHeight: 0.6, // how much height can the bot step on without jump
    negligeableVelocity: 0.003, // actually 0.005 for 1.8, but seems fine
    soulsandSpeed: 0.4,
    honeyblockSpeed: 0.4,
    honeyblockJumpSpeed: 0.4,
    ladderMaxSpeed: 0.15,
    ladderClimbSpeed: 0.2,
    playerHalfWidth: 0.3,
    playerHeight: 1.8,
    waterInertia: 0.8,
    lavaInertia: 0.5,
    liquidAcceleration: 0.02,
    airborneInertia: 0.91,
    airborneAcceleration: 0.02,
    defaultSlipperiness: 0.6,
    outOfLiquidImpulse: 0.3,
    autojumpCooldown: 10, // ticks (0.5s)
    bubbleColumnSurfaceDrag: {
      down: 0.03,
      maxDown: -0.9,
      up: 0.1,
      maxUp: 1.8
    },
    bubbleColumnDrag: {
      down: 0.03,
      maxDown: -0.3,
      up: 0.06,
      maxUp: 0.7
    },
    slowFalling: 0.125,
    movementSpeedAttribute: mcData.attributesByName.movementSpeed.resource,
    sprintingUUID: '662a6b8d-da3e-4c1c-8813-96ea6097278d' // SPEED_MODIFIER_SPRINTING_UUID is from LivingEntity.java
  }

  if (supportFeature('independentLiquidGravity')) {
    physics.waterGravity = 0.02
    physics.lavaGravity = 0.02
  } else if (supportFeature('proportionalLiquidGravity')) {
    physics.waterGravity = physics.gravity / 16
    physics.lavaGravity = physics.gravity / 4
  }

  function getPlayerBB (pos) {
    const w = physics.playerHalfWidth
    return new AABB(-w, 0, -w, w, physics.playerHeight, w).offset(pos.x, pos.y, pos.z)
  }

  function setPositionToBB (bb, pos) {
    pos.x = bb.minX + physics.playerHalfWidth
    pos.y = bb.minY
    pos.z = bb.minZ + physics.playerHalfWidth
  }

  function getSurroundingBBs (world, queryBB) {
    const surroundingBBs = []
    const cursor = new Vec3(0, 0, 0)
    for (cursor.y = Math.floor(queryBB.minY) - 1; cursor.y <= Math.floor(queryBB.maxY); cursor.y++) {
      for (cursor.z = Math.floor(queryBB.minZ); cursor.z <= Math.floor(queryBB.maxZ); cursor.z++) {
        for (cursor.x = Math.floor(queryBB.minX); cursor.x <= Math.floor(queryBB.maxX); cursor.x++) {
          const block = world.getBlock(cursor)
          if (block) {
            const blockPos = block.position
            for (const shape of block.shapes) {
              const blockBB = new AABB(shape[0], shape[1], shape[2], shape[3], shape[4], shape[5])
              blockBB.offset(blockPos.x, blockPos.y, blockPos.z)
              surroundingBBs.push(blockBB)
            }
          }
        }
      }
    }
    return surroundingBBs
  }

  physics.adjustPositionHeight = (pos) => {
    const playerBB = getPlayerBB(pos)
    const queryBB = playerBB.clone().extend(0, -1, 0)
    const surroundingBBs = getSurroundingBBs(world, queryBB)

    let dy = -1
    for (const blockBB of surroundingBBs) {
      dy = blockBB.computeOffsetY(playerBB, dy)
    }
    pos.y += dy
  }

  function moveEntity (entity, world, dx, dy, dz) {
    const vel = entity.vel
    const pos = entity.pos

    if (entity.isInWeb) {
      dx *= 0.25
      dy *= 0.05
      dz *= 0.25
      vel.x = 0
      vel.y = 0
      vel.z = 0
      entity.isInWeb = false
    }

    let oldVelX = dx
    const oldVelY = dy
    let oldVelZ = dz

    if (entity.control.sneak && entity.onGround) {
      const step = 0.05

      // In the 3 loops bellow, y offset should be -1, but that doesnt reproduce vanilla behavior.
      for (; dx !== 0 && getSurroundingBBs(world, getPlayerBB(pos).offset(dx, 0, 0)).length === 0; oldVelX = dx) {
        if (dx < step && dx >= -step) dx = 0
        else if (dx > 0) dx -= step
        else dx += step
      }

      for (; dz !== 0 && getSurroundingBBs(world, getPlayerBB(pos).offset(0, 0, dz)).length === 0; oldVelZ = dz) {
        if (dz < step && dz >= -step) dz = 0
        else if (dz > 0) dz -= step
        else dz += step
      }

      while (dx !== 0 && dz !== 0 && getSurroundingBBs(world, getPlayerBB(pos).offset(dx, 0, dz)).length === 0) {
        if (dx < step && dx >= -step) dx = 0
        else if (dx > 0) dx -= step
        else dx += step

        if (dz < step && dz >= -step) dz = 0
        else if (dz > 0) dz -= step
        else dz += step

        oldVelX = dx
        oldVelZ = dz
      }
    }

    let playerBB = getPlayerBB(pos)
    const queryBB = playerBB.clone().extend(dx, dy, dz)
    const surroundingBBs = getSurroundingBBs(world, queryBB)
    const oldBB = playerBB.clone()

    for (const blockBB of surroundingBBs) {
      dy = blockBB.computeOffsetY(playerBB, dy)
    }
    playerBB.offset(0, dy, 0)

    for (const blockBB of surroundingBBs) {
      dx = blockBB.computeOffsetX(playerBB, dx)
    }
    playerBB.offset(dx, 0, 0)

    for (const blockBB of surroundingBBs) {
      dz = blockBB.computeOffsetZ(playerBB, dz)
    }
    playerBB.offset(0, 0, dz)

    // Step on block if height < stepHeight
    if (physics.stepHeight > 0 &&
      (entity.onGround || (dy !== oldVelY && oldVelY < 0)) &&
      (dx !== oldVelX || dz !== oldVelZ)) {
      const oldVelXCol = dx
      const oldVelYCol = dy
      const oldVelZCol = dz
      const oldBBCol = playerBB.clone()

      dy = physics.stepHeight
      const queryBB = oldBB.clone().extend(oldVelX, dy, oldVelZ)
      const surroundingBBs = getSurroundingBBs(world, queryBB)

      const BB1 = oldBB.clone()
      const BB2 = oldBB.clone()
      const BB_XZ = BB1.clone().extend(dx, 0, dz)

      let dy1 = dy
      let dy2 = dy
      for (const blockBB of surroundingBBs) {
        dy1 = blockBB.computeOffsetY(BB_XZ, dy1)
        dy2 = blockBB.computeOffsetY(BB2, dy2)
      }
      BB1.offset(0, dy1, 0)
      BB2.offset(0, dy2, 0)

      let dx1 = oldVelX
      let dx2 = oldVelX
      for (const blockBB of surroundingBBs) {
        dx1 = blockBB.computeOffsetX(BB1, dx1)
        dx2 = blockBB.computeOffsetX(BB2, dx2)
      }
      BB1.offset(dx1, 0, 0)
      BB2.offset(dx2, 0, 0)

      let dz1 = oldVelZ
      let dz2 = oldVelZ
      for (const blockBB of surroundingBBs) {
        dz1 = blockBB.computeOffsetZ(BB1, dz1)
        dz2 = blockBB.computeOffsetZ(BB2, dz2)
      }
      BB1.offset(0, 0, dz1)
      BB2.offset(0, 0, dz2)

      const norm1 = dx1 * dx1 + dz1 * dz1
      const norm2 = dx2 * dx2 + dz2 * dz2

      if (norm1 > norm2) {
        dx = dx1
        dy = -dy1
        dz = dz1
        playerBB = BB1
      } else {
        dx = dx2
        dy = -dy2
        dz = dz2
        playerBB = BB2
      }

      for (const blockBB of surroundingBBs) {
        dy = blockBB.computeOffsetY(playerBB, dy)
      }
      playerBB.offset(0, dy, 0)

      if (oldVelXCol * oldVelXCol + oldVelZCol * oldVelZCol >= dx * dx + dz * dz) {
        dx = oldVelXCol
        dy = oldVelYCol
        dz = oldVelZCol
        playerBB = oldBBCol
      }
    }

    // Update flags
    setPositionToBB(playerBB, pos)
    entity.isCollidedHorizontally = dx !== oldVelX || dz !== oldVelZ
    entity.isCollidedVertically = dy !== oldVelY
    entity.onGround = entity.isCollidedVertically && oldVelY < 0

    const blockAtFeet = world.getBlock(pos.offset(0, -0.2, 0))

    if (dx !== oldVelX) vel.x = 0
    if (dz !== oldVelZ) vel.z = 0
    if (dy !== oldVelY) {
      if (blockAtFeet && blockAtFeet.type === slimeBlockId && !entity.control.sneak) {
        vel.y = -vel.y
      } else {
        vel.y = 0
      }
    }

    // Finally, apply block collisions (web, soulsand...)
    playerBB.contract(0.001, 0.001, 0.001)
    const cursor = new Vec3(0, 0, 0)
    for (cursor.y = Math.floor(playerBB.minY); cursor.y <= Math.floor(playerBB.maxY); cursor.y++) {
      for (cursor.z = Math.floor(playerBB.minZ); cursor.z <= Math.floor(playerBB.maxZ); cursor.z++) {
        for (cursor.x = Math.floor(playerBB.minX); cursor.x <= Math.floor(playerBB.maxX); cursor.x++) {
          const block = world.getBlock(cursor)
          if (block) {
            if (supportFeature('velocityBlocksOnCollision')) {
              if (block.type === soulsandId) {
                vel.x *= physics.soulsandSpeed
                vel.z *= physics.soulsandSpeed
              } else if (block.type === honeyblockId) {
                vel.x *= physics.honeyblockSpeed
                vel.z *= physics.honeyblockSpeed
              }
            }
            if (block.type === webId) {
              entity.isInWeb = true
            } else if (block.type === bubblecolumnId) {
              const down = !block.metadata
              const aboveBlock = world.getBlock(cursor.offset(0, 1, 0))
              const bubbleDrag = (aboveBlock && aboveBlock.type === 0 /* air */) ? physics.bubbleColumnSurfaceDrag : physics.bubbleColumnDrag
              if (down) {
                vel.y = Math.max(bubbleDrag.maxDown, vel.y - bubbleDrag.down)
              } else {
                vel.y = Math.min(bubbleDrag.maxUp, vel.y + bubbleDrag.up)
              }
            }
          }
        }
      }
    }
    if (supportFeature('velocityBlocksOnTop')) {
      const blockBelow = world.getBlock(entity.pos.floored().offset(0, -0.5, 0))
      if (blockBelow) {
        if (blockBelow.type === soulsandId) {
          vel.x *= physics.soulsandSpeed
          vel.z *= physics.soulsandSpeed
        } else if (blockBelow.type === honeyblockId) {
          vel.x *= physics.honeyblockSpeed
          vel.z *= physics.honeyblockSpeed
        }
      }
    }
  }

  function applyHeading (entity, strafe, forward, multiplier) {
    let speed = Math.sqrt(strafe * strafe + forward * forward)
    if (speed < 0.01) return new Vec3(0, 0, 0)

    speed = multiplier / Math.max(speed, 1)

    strafe *= speed
    forward *= speed

    const yaw = Math.PI - entity.yaw
    const sin = Math.sin(yaw)
    const cos = Math.cos(yaw)

    const vel = entity.vel
    vel.x += strafe * cos - forward * sin
    vel.z += forward * cos + strafe * sin
  }

  function isOnLadder (world, pos) {
    const block = world.getBlock(pos)
    return (block && (block.type === ladderId || block.type === vineId))
  }

  function doesNotCollide (world, pos) {
    const pBB = getPlayerBB(pos)
    return !getSurroundingBBs(world, pBB).some(x => pBB.intersects(x)) && getWaterInBB(world, pBB).length === 0
  }

  function moveEntityWithHeading (entity, world, strafe, forward) {
    const vel = entity.vel
    const pos = entity.pos

    const gravityMultiplier = (vel.y <= 0 && entity.slowFalling > 0) ? physics.slowFalling : 1

    if (!entity.isInWater && !entity.isInLava) {
      // Normal movement
      let acceleration = physics.airborneAcceleration
      let inertia = physics.airborneInertia
      const blockUnder = world.getBlock(pos.offset(0, -1, 0))
      if (entity.onGround && blockUnder) {
        let playerSpeedAttribute
        if (entity.attributes && entity.attributes[physics.movementSpeedAttribute]) {
          // Use server-side player attributes
          playerSpeedAttribute = entity.attributes[physics.movementSpeedAttribute]
        } else {
          // Create an attribute if the player does not have it
          playerSpeedAttribute = attribute.createAttributeValue(physics.playerSpeed)
        }
        // Client-side sprinting (don't rely on server-side sprinting)
        // setSprinting in LivingEntity.java
        playerSpeedAttribute = attribute.deleteAttributeModifier(playerSpeedAttribute, physics.sprintingUUID) // always delete sprinting (if it exists)
        if (entity.control.sprint) {
          if (!attribute.checkAttributeModifier(playerSpeedAttribute, physics.sprintingUUID)) {
            playerSpeedAttribute = attribute.addAttributeModifier(playerSpeedAttribute, {
              uuid: physics.sprintingUUID,
              amount: physics.sprintSpeed,
              operation: 2
            })
          }
        }
        // Calculate what the speed is (0.1 if no modification)
        const attributeSpeed = attribute.getAttributeValue(playerSpeedAttribute)
        inertia = (blockSlipperiness[blockUnder.type] || physics.defaultSlipperiness) * 0.91
        acceleration = attributeSpeed * (0.1627714 / (inertia * inertia * inertia))
        if (acceleration < 0) acceleration = 0 // acceleration should not be negative
      }

      applyHeading(entity, strafe, forward, acceleration)

      if (isOnLadder(world, pos)) {
        vel.x = math.clamp(-physics.ladderMaxSpeed, vel.x, physics.ladderMaxSpeed)
        vel.z = math.clamp(-physics.ladderMaxSpeed, vel.z, physics.ladderMaxSpeed)
        vel.y = Math.max(vel.y, entity.control.sneak ? 0 : -physics.ladderMaxSpeed)
      }

      moveEntity(entity, world, vel.x, vel.y, vel.z)

      if (isOnLadder(world, pos) && (entity.isCollidedHorizontally ||
        (supportFeature('climbUsingJump') && entity.control.jump))) {
        vel.y = physics.ladderClimbSpeed // climb ladder
      }

      // Apply friction and gravity
      if (entity.levitation > 0) {
        vel.y += (0.05 * entity.levitation - vel.y) * 0.2
      } else {
        vel.y -= physics.gravity * gravityMultiplier
      }
      vel.y *= physics.airdrag
      vel.x *= inertia
      vel.z *= inertia
    } else {
      // Water / Lava movement
      const lastY = pos.y
      let acceleration = physics.liquidAcceleration
      const inertia = entity.isInWater ? physics.waterInertia : physics.lavaInertia
      let horizontalInertia = inertia

      if (entity.isInWater) {
        let strider = Math.min(entity.depthStrider, 3)
        if (!entity.onGround) {
          strider *= 0.5
        }
        if (strider > 0) {
          horizontalInertia += (0.546 - horizontalInertia) * strider / 3
          acceleration += (0.7 - acceleration) * strider / 3
        }

        if (entity.dolphinsGrace > 0) horizontalInertia = 0.96
      }

      applyHeading(entity, strafe, forward, acceleration)
      moveEntity(entity, world, vel.x, vel.y, vel.z)
      vel.y *= inertia
      vel.y -= (entity.isInWater ? physics.waterGravity : physics.lavaGravity) * gravityMultiplier
      vel.x *= horizontalInertia
      vel.z *= horizontalInertia

      if (entity.isCollidedHorizontally && doesNotCollide(world, pos.offset(vel.x, vel.y + 0.6 - pos.y + lastY, vel.z))) {
        vel.y = physics.outOfLiquidImpulse // jump out of liquid
      }
    }
  }

  function isMaterialInBB (world, queryBB, type) {
    const cursor = new Vec3(0, 0, 0)
    for (cursor.y = Math.floor(queryBB.minY); cursor.y <= Math.floor(queryBB.maxY); cursor.y++) {
      for (cursor.z = Math.floor(queryBB.minZ); cursor.z <= Math.floor(queryBB.maxZ); cursor.z++) {
        for (cursor.x = Math.floor(queryBB.minX); cursor.x <= Math.floor(queryBB.maxX); cursor.x++) {
          const block = world.getBlock(cursor)
          if (block && block.type === type) return true
        }
      }
    }
    return false
  }

  function getLiquidHeightPcent (block) {
    return (getRenderedDepth(block) + 1) / 9
  }

  function getRenderedDepth (block) {
    if (!block) return -1
    if (waterLike.has(block.type)) return 0
    if (block.getProperties().waterlogged) return 0
    if (block.type !== waterId) return -1
    const meta = block.metadata
    return meta >= 8 ? 0 : meta
  }

  function getFlow (world, block) {
    const curlevel = getRenderedDepth(block)
    const flow = new Vec3(0, 0, 0)
    for (const [dx, dz] of [[0, 1], [-1, 0], [0, -1], [1, 0]]) {
      const adjBlock = world.getBlock(block.position.offset(dx, 0, dz))
      const adjLevel = getRenderedDepth(adjBlock)
      if (adjLevel < 0) {
        if (adjBlock && adjBlock.boundingBox !== 'empty') {
          const adjLevel = getRenderedDepth(world.getBlock(block.position.offset(dx, -1, dz)))
          if (adjLevel >= 0) {
            const f = adjLevel - (curlevel - 8)
            flow.x += dx * f
            flow.z += dz * f
          }
        }
      } else {
        const f = adjLevel - curlevel
        flow.x += dx * f
        flow.z += dz * f
      }
    }

    if (block.metadata >= 8) {
      for (const [dx, dz] of [[0, 1], [-1, 0], [0, -1], [1, 0]]) {
        const adjBlock = world.getBlock(block.position.offset(dx, 0, dz))
        const adjUpBlock = world.getBlock(block.position.offset(dx, 1, dz))
        if ((adjBlock && adjBlock.boundingBox !== 'empty') || (adjUpBlock && adjUpBlock.boundingBox !== 'empty')) {
          flow.normalize().translate(0, -6, 0)
        }
      }
    }

    return flow.normalize()
  }

  function getWaterInBB (world, bb) {
    const waterBlocks = []
    const cursor = new Vec3(0, 0, 0)
    for (cursor.y = Math.floor(bb.minY); cursor.y <= Math.floor(bb.maxY); cursor.y++) {
      for (cursor.z = Math.floor(bb.minZ); cursor.z <= Math.floor(bb.maxZ); cursor.z++) {
        for (cursor.x = Math.floor(bb.minX); cursor.x <= Math.floor(bb.maxX); cursor.x++) {
          const block = world.getBlock(cursor)
          if (block && (block.type === waterId || waterLike.has(block.type) || block.getProperties().waterlogged)) {
            const waterLevel = cursor.y + 1 - getLiquidHeightPcent(block)
            if (Math.ceil(bb.maxY) >= waterLevel) waterBlocks.push(block)
          }
        }
      }
    }
    return waterBlocks
  }

  function isInWaterApplyCurrent (world, bb, vel) {
    const acceleration = new Vec3(0, 0, 0)
    const waterBlocks = getWaterInBB(world, bb)
    const isInWater = waterBlocks.length > 0
    for (const block of waterBlocks) {
      const flow = getFlow(world, block)
      acceleration.add(flow)
    }

    const len = acceleration.norm()
    if (len > 0) {
      vel.x += acceleration.x / len * 0.014
      vel.y += acceleration.y / len * 0.014
      vel.z += acceleration.z / len * 0.014
    }
    return isInWater
  }

  physics.simulatePlayer = (entity, world) => {
    const vel = entity.vel
    const pos = entity.pos

    const waterBB = getPlayerBB(pos).contract(0.001, 0.401, 0.001)
    const lavaBB = getPlayerBB(pos).contract(0.1, 0.4, 0.1)

    entity.isInWater = isInWaterApplyCurrent(world, waterBB, vel)
    entity.isInLava = isMaterialInBB(world, lavaBB, lavaId)

    // Reset velocity component if it falls under the threshold
    if (Math.abs(vel.x) < physics.negligeableVelocity) vel.x = 0
    if (Math.abs(vel.y) < physics.negligeableVelocity) vel.y = 0
    if (Math.abs(vel.z) < physics.negligeableVelocity) vel.z = 0

    // Handle inputs
    if (entity.control.jump || entity.jumpQueued) {
      if (entity.jumpTicks > 0) entity.jumpTicks--
      if (entity.isInWater || entity.isInLava) {
        vel.y += 0.04
      } else if (entity.onGround && entity.jumpTicks === 0) {
        const blockBelow = world.getBlock(entity.pos.floored().offset(0, -0.5, 0))
        vel.y = Math.fround(0.42) * ((blockBelow && blockBelow.type === honeyblockId) ? physics.honeyblockJumpSpeed : 1)
        if (entity.jumpBoost > 0) {
          vel.y += 0.1 * entity.jumpBoost
        }
        if (entity.control.sprint) {
          const yaw = Math.PI - entity.yaw
          vel.x -= Math.sin(yaw) * 0.2
          vel.z += Math.cos(yaw) * 0.2
        }
        entity.jumpTicks = physics.autojumpCooldown
      }
    } else {
      entity.jumpTicks = 0 // reset autojump cooldown
    }
    entity.jumpQueued = false

    let strafe = (entity.control.right - entity.control.left) * 0.98
    let forward = (entity.control.forward - entity.control.back) * 0.98

    if (entity.control.sneak) {
      strafe *= physics.sneakSpeed
      forward *= physics.sneakSpeed
    }

    moveEntityWithHeading(entity, world, strafe, forward)

    return entity
  }

  return physics
}

function getEffectLevel (mcData, effectName, effects) {
  const effectDescriptor = mcData.effectsByName[effectName]
  if (!effectDescriptor) {
    return 0
  }
  const effectInfo = effects[effectDescriptor.id]
  if (!effectInfo) {
    return 0
  }
  return effectInfo.amplifier + 1
}

function getEnchantmentLevel (mcData, enchantmentName, enchantments) {
  const enchantmentDescriptor = mcData.enchantmentsByName[enchantmentName]
  if (!enchantmentDescriptor) {
    return 0
  }

  for (const enchInfo of enchantments) {
    if (typeof enchInfo.id === 'string') {
      if (enchInfo.id.includes(enchantmentName)) {
        return enchInfo.lvl
      }
    } else if (enchInfo.id === enchantmentDescriptor.id) {
      return enchInfo.lvl
    }
  }
  return 0
}

function getStatusEffectNamesForVersion (supportFeature) {
  if (supportFeature('effectNamesAreRegistryNames')) {
    return {
      jumpBoostEffectName: 'jump_boost',
      speedEffectName: 'speed',
      slownessEffectName: 'slowness',
      dolphinsGraceEffectName: 'dolphins_grace',
      slowFallingEffectName: 'slow_falling',
      levitationEffectName: 'levitation'
    }
  } else {
    return {
      jumpBoostEffectName: 'JumpBoost',
      speedEffectName: 'Speed',
      slownessEffectName: 'Slowness',
      dolphinsGraceEffectName: 'DolphinsGrace',
      slowFallingEffectName: 'SlowFalling',
      levitationEffectName: 'Levitation'
    }
  }
}

class PlayerState {
  constructor (bot, control) {
    const mcData = require('minecraft-data')(bot.version)
    const nbt = require('prismarine-nbt')
    const supportFeature = makeSupportFeature(mcData)

    // Input / Outputs
    this.pos = bot.entity.position.clone()
    this.vel = bot.entity.velocity.clone()
    this.onGround = bot.entity.onGround
    this.isInWater = bot.entity.isInWater
    this.isInLava = bot.entity.isInLava
    this.isInWeb = bot.entity.isInWeb
    this.isCollidedHorizontally = bot.entity.isCollidedHorizontally
    this.isCollidedVertically = bot.entity.isCollidedVertically
    this.jumpTicks = bot.jumpTicks
    this.jumpQueued = bot.jumpQueued

    // Input only (not modified)
    this.attributes = bot.entity.attributes
    this.yaw = bot.entity.yaw
    this.control = control

    // effects
    const effects = bot.entity.effects
    const statusEffectNames = getStatusEffectNamesForVersion(supportFeature)

    this.jumpBoost = getEffectLevel(mcData, statusEffectNames.jumpBoostEffectName, effects)
    this.speed = getEffectLevel(mcData, statusEffectNames.speedEffectName, effects)
    this.slowness = getEffectLevel(mcData, statusEffectNames.slownessEffectName, effects)

    this.dolphinsGrace = getEffectLevel(mcData, statusEffectNames.dolphinsGraceEffectName, effects)
    this.slowFalling = getEffectLevel(mcData, statusEffectNames.slowFallingEffectName, effects)
    this.levitation = getEffectLevel(mcData, statusEffectNames.levitationEffectName, effects)

    // armour enchantments
    const boots = bot.inventory.slots[8]
    if (boots && boots.nbt) {
      const simplifiedNbt = nbt.simplify(boots.nbt)
      const enchantments = simplifiedNbt.Enchantments ?? simplifiedNbt.ench ?? []
      this.depthStrider = getEnchantmentLevel(mcData, 'depth_strider', enchantments)
    } else {
      this.depthStrider = 0
    }
  }

  apply (bot) {
    bot.entity.position = this.pos
    bot.entity.velocity = this.vel
    bot.entity.onGround = this.onGround
    bot.entity.isInWater = this.isInWater
    bot.entity.isInLava = this.isInLava
    bot.entity.isInWeb = this.isInWeb
    bot.entity.isCollidedHorizontally = this.isCollidedHorizontally
    bot.entity.isCollidedVertically = this.isCollidedVertically
    bot.jumpTicks = this.jumpTicks
    bot.jumpQueued = this.jumpQueued
  }
}

module.exports = { Physics, PlayerState }
