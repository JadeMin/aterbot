module.exports = {
  Endpoints: {
    PCXSTSRelyingParty: 'rp://api.minecraftservices.com/',
    BedrockXSTSRelyingParty: 'https://multiplayer.minecraft.net/',
    XboxXSTSRelyingParty: 'http://auth.xboxlive.com/',
    BedrockAuth: 'https://multiplayer.minecraft.net/authentication',
    XboxDeviceAuth: 'https://device.auth.xboxlive.com/device/authenticate',
    XboxTitleAuth: 'https://title.auth.xboxlive.com/title/authenticate',
    SisuAuthorize: 'https://sisu.xboxlive.com/authorize',
    XstsAuthorize: 'https://xsts.auth.xboxlive.com/xsts/authorize',
    MinecraftServicesLogWithXbox: 'https://api.minecraftservices.com/authentication/login_with_xbox',
    MinecraftServicesEntitlement: 'https://api.minecraftservices.com/entitlements/mcstore',
    MinecraftServicesProfile: 'https://api.minecraftservices.com/minecraft/profile',
    LiveDeviceCodeRequest: 'https://login.live.com/oauth20_connect.srf',
    LiveTokenRequest: 'https://login.live.com/oauth20_token.srf'
  },
  msalConfig: {
    // Initialize msal
    // Docs: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/request.md#public-apis-1
    auth: {
      // the minecraft client:
      // clientId: "000000004C12AE6F",
      clientId: '389b1b32-b5d5-43b2-bddc-84ce938d6737', // token from https://github.com/microsoft/Office365APIEditor
      authority: 'https://login.microsoftonline.com/consumers'
    }
  },
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'node-minecraft-protocol'
    }
  }
}
