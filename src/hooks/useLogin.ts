import { useAccount, useSignMessage, useChainId } from "wagmi";
import { useAuthStore } from "../store/useAuthStore";
import { createSiweMessage } from "../utils";

export default function useLogin() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { loginAsync, refreshNounce } = useAuthStore();

  const signAndLogin = async (loginCallback: () => void) => {
    if (!address) {
      return;
    }
    // get nonce
    let nonce: string = "";
    try {
      nonce = await refreshNounce(address);
    } catch (error) {
      throw new Error("Error getting nonce");
    }
    const msg = createSiweMessage(
      address,
      chainId,
      nonce,
      "Welcom Quick Accounting"
    );
    const signResult = await signMessageAsync({ message: msg });
    await loginAsync(
      {
        domain: window.location.origin,
        message: msg,
        signature: signResult,
        wallet: address,
      },
      loginCallback
    );
    return true;
  };
  return signAndLogin;
}
