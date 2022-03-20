import axios from "axios";
import * as socean from "@soceanfi/stake-pool-sdk";
import dayjs from "dayjs";
import { InceptionDate } from "./constants";
import * as web3 from "@solana/web3.js";

const calculateApy = (
  solDeposited: number,
  xSOLminted: number,
  inceptionDate: string
) => {
  const daysSinceInception = dayjs().diff(dayjs(inceptionDate), "days", true);
  return ((solDeposited / xSOLminted - 1) / daysSinceInception) * 365.25;
};

export const getMarinadeApy = async () => {
  const apy = await axios.get("https://api.marinade.finance/msol/apy/5y");
  return apy.data.value;
};

export const getSoceanApy = async () => {
  const solRes = await axios.get("https://socean.fi/api/tvl");
  const xsolRes = await axios.get("https://www.socean.fi/api/tvlscnsol");

  const apy = calculateApy(solRes.data, xsolRes.data, InceptionDate.SOCEAN);
  return apy;
};
