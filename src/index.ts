import { StakePool } from "./interface";
import { Connection } from "@solana/web3.js";
import {
  Marinade,
  BN,
  Provider,
  Wallet,
} from "@marinade.finance/marinade-ts-sdk";
import { Numberu64, Socean, WalletAdapter } from "@soceanfi/stake-pool-sdk";
import { getMarinadeApy, getSoceanApy } from "./getApy";

const stakeMarinade = async (
  connection: Connection,
  wallet: Wallet,
  lamports: number
) => {
  const { transaction } = await new Marinade().deposit(new BN(lamports));
  const signature = await new Provider(connection, wallet, {}).send(
    transaction
  );
};

const stakeSocean = async (wallet: WalletAdapter, lamports: number) => {
  const signatures = await new Socean().depositSol(
    wallet,
    new Numberu64(lamports)
  );
};

const stake = async (
  con: Connection,
  wallet: Wallet,
  lamports: number,
  stakePool?: StakePool
) => {
  switch (stakePool) {
    case StakePool.MARINADE:
      stakeMarinade(con, wallet, lamports);
      break;
    case StakePool.SOCEAN:
      stakeSocean(wallet, lamports);
      break;
    default:
      const soceanApy = await getSoceanApy();
      const marinadeApy = await getMarinadeApy();

      if (soceanApy > marinadeApy) {
        stakeSocean(wallet, lamports);
      } else {
        stakeMarinade(con, wallet, lamports);
      }
  }
};

module.exports = {
  stake,
  getMarinadeApy,
  getSoceanApy,
};
