import mcData from 'minecraft-data'

declare module "prismarine-registry" {
  export default function(mcVersion: string): ReturnType<typeof mcData>
}