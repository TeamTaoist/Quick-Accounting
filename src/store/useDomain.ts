import { create } from "zustand";
import { getAddress } from "viem";
import sns from "@seedao/sns-js";
import { getEnsName } from "@wagmi/core";

import { config } from "../providers/wagmiProvider";
import { getShortAddress } from "../utils";
import { useWorkspace } from "./useWorkspace";

const ENS_SPPORTED_CHAINS = [1, 5, 11155111];

interface IDomainStore {
  // address to name
  snsAddressToNameMap: Map<string, string>;
  ensAddressToNameMap_1: Map<string, string>;
  ensAddressToNameMap_5: Map<string, string>;
  ensAddressToNameMap_11155111: Map<string, string>;
  // name to address
  snsNameToAddressMap: Map<string, string>;
  ensNameToAddressMap_1: Map<string, string>;
  ensNameToAddressMap_5: Map<string, string>;
  ensNameToAddressMap_11155111: Map<string, string>;

  querySNS: (wallets: string[]) => void;
  queryENS: (wallets: string[], chainId: number) => void;
  queryNameService: (
    payments: IPaymentRequest[],
    isSNS?: boolean,
    chainId?: number
  ) => void;
  formatAddressToDomain: (
    wallet: string,
    chainId: number,
    isSNS?: boolean
  ) => string;
}

export const useDomainStore = create<IDomainStore>((set, get) => ({
  snsAddressToNameMap: new Map(),
  ensAddressToNameMap_1: new Map(),
  ensAddressToNameMap_5: new Map(),
  ensAddressToNameMap_11155111: new Map(),
  snsNameToAddressMap: new Map(),
  ensNameToAddressMap_1: new Map(),
  ensNameToAddressMap_5: new Map(),
  ensNameToAddressMap_11155111: new Map(),
  querySNS: (wallets: string[]) => {
    const { snsAddressToNameMap } = get();
    const _to_be_queried = new Array<string>();
    wallets.forEach((w) => {
      const v = snsAddressToNameMap.get(w);
      if (typeof v !== "string") {
        _to_be_queried.push(w.toLocaleLowerCase());
      }
    });
    const _to_be_queried_unique = Array.from(new Set(_to_be_queried));
    if (_to_be_queried_unique.length === 0) return;
    sns.names(_to_be_queried_unique).then((res) => {
      const _new_sns_map = new Map(snsAddressToNameMap);
      res.forEach((d, idx) => {
        _new_sns_map.set(_to_be_queried_unique[idx], d);
      });
      set({ snsAddressToNameMap: _new_sns_map });
    });
  },
  queryENS: (wallets: string[], chainId: number) => {
    const isSupportedChain = ENS_SPPORTED_CHAINS.includes(chainId);
    if (!isSupportedChain) return;
    const k = `ensAddressToNameMap_${chainId}`;
    // @ts-ignore
    const ensAddressToNameMap = get()[k];
    const _to_be_queried = new Array<string>();
    wallets.forEach((w) => {
      const v = ensAddressToNameMap.get(w.toLocaleLowerCase());
      if (typeof v !== "string") {
        _to_be_queried.push(w.toLocaleLowerCase());
      }
    });
    const _to_be_queried_unique = Array.from(new Set(_to_be_queried));
    const _to_be_queried_requests = _to_be_queried_unique.map((w) =>
      getEnsName(config, {
        address: w.toLocaleLowerCase() as `0x${string}`,
      })
    );
    if (_to_be_queried_unique.length === 0) return;
    Promise.all(_to_be_queried_requests).then((res) => {
      const _new_ens_map = new Map(ensAddressToNameMap);
      res.forEach((d, idx) => {
        _new_ens_map.set(_to_be_queried_unique[idx], d || "");
      });
      set({ [k]: _new_ens_map });
    });
  },
  queryNameService: (
    payments: IPaymentRequest[],
    isSNS?: boolean,
    chainId?: number
  ) => {
    if (isSNS !== undefined) {
      const wallets = payments.map((p) => p.counterparty);
      if (!wallets.length) {
        return;
      }
      const { querySNS, queryENS } = get();
      if (isSNS) {
        querySNS(wallets);
      } else if (chainId) {
        queryENS(wallets, chainId);
      }
      return;
    }
    // sns
    const sns_wallets = payments
      ?.filter((p) => p.name_service === "sns")
      .map((p) => p.counterparty);
    const { querySNS } = get();
    if (sns_wallets?.length) {
      querySNS(sns_wallets);
    }
    // ens
    const ens_list = payments?.filter((p) => p.name_service !== "sns");
    if (ens_list?.length) {
      const chain_id_map = new Map<number, string[]>();
      ens_list.forEach((p) => {
        const chain_id = p.workspace_chain_id;
        const _wallets = chain_id_map.get(chain_id) || [];
        _wallets.push(p.counterparty);
        chain_id_map.set(chain_id, _wallets);
      });
      if (chain_id_map.size) {
        const { queryENS } = get();
        chain_id_map.forEach((wallets, chain_id) => {
          queryENS(wallets, chain_id);
        });
      }
    }
  },
  formatAddressToDomain: (wallet: string, chainId: number, isSNS?: boolean) => {
    if (!wallet) {
      return "";
    }
    if (isSNS) {
      const { snsAddressToNameMap } = get();
      return (
        snsAddressToNameMap.get(wallet.toLocaleLowerCase()) ||
        getShortAddress(getAddress(wallet))
      );
    }
    // ens
    const isSupportedChain = ENS_SPPORTED_CHAINS.includes(chainId);
    if (isSupportedChain) {
      // @ts-ignore
      const ensAddressToNameMap = get()[`ensAddressToNameMap_${chainId}`];
      return (
        ensAddressToNameMap.get(wallet.toLocaleLowerCase()) ||
        getShortAddress(getAddress(wallet))
      );
    }
    return "";
  },
}));
