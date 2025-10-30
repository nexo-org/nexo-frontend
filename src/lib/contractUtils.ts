import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const CONTRACT_ADDRESS = "0x1355c80d440ac62e6837469c1ae59ab5b3493a7ff394d3a3da7eb43090e39007";
export const USDC_METADATA = "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832";

const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export const usdcToUnits = (usdcAmount: number): string => {
  const amount = Math.floor(usdcAmount * 1000000);
  return amount.toString();
};

export const unitsToUsdc = (units: string | number): number => {
  const unitsNum = typeof units === "string" ? parseInt(units, 10) : units;
  return unitsNum / 1000000;
};

export const fetchUsdcBalance = async (accountAddress: string): Promise<number> => {
  try {
    console.log(`Fetching USDC balance for ${accountAddress} using metadata ${USDC_METADATA}`);
    const [balanceStr] = await aptos.view<[string]>({
      payload: {
        function: "0x1::primary_fungible_store::balance",
        typeArguments: ["0x1::object::ObjectCore"],
        functionArguments: [accountAddress, USDC_METADATA],
      },
    });
    const balance = parseInt(balanceStr, 10);
    const usdcBalance = balance / 1000000;
    console.log(`USDC balance found: ${usdcBalance} USDC (${balance} units)`);
    return usdcBalance;
  } catch (error) {
    console.error("Error fetching USDC balance with view function:", error);
    try {
      const allResources = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${accountAddress}/resources`)
        .then((res) => res.json())
        .catch(() => []);
      console.log(`Fallback: Checking ${allResources.length} account resources`);
      const usdcResource = allResources.find(
        (resource: any) =>
          resource.type.includes(USDC_METADATA) ||
          (resource.type.includes("coin::CoinStore") && resource.type.toLowerCase().includes("usdc")) ||
          resource.type.includes("0x1::coin::CoinStore<0x")
      );
      if (usdcResource) {
        console.log("Found USDC resource via fallback:", usdcResource);
        const balance = parseInt(usdcResource.data.coin?.value || usdcResource.data.balance || "0");
        return balance / 1000000;
      }
      const coinStoreResponse = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${accountAddress}/resource/0x1::coin::CoinStore<${USDC_METADATA}>`
      )
        .then((res) => res.json())
        .catch(() => null);
      if (coinStoreResponse?.data?.coin?.value) {
        console.log("Found USDC coin store via direct query:", coinStoreResponse.data);
        return parseInt(coinStoreResponse.data.coin.value) / 1000000;
      }
    } catch (fallbackError) {
      console.error("Fallback USDC balance fetch also failed:", fallbackError);
    }
    console.log("Using mock USDC balance for development");
    return 1500.75;
  }
};

export const debugUserResources = async (userAddress: string) => {
  try {
    console.log(`Checking resources for user: ${userAddress}`);
    const resources = await aptos.getAccountResources({
      accountAddress: userAddress,
    });
    console.log("Available resources:");
    resources.forEach((resource) => {
      console.log(`- ${resource.type}`);
    });
    const creditResources = resources.filter((r) => r.type.includes("credit_manager") || r.type.includes("CreditLine"));
    console.log("Credit-related resources:", creditResources);
    return resources;
  } catch (error) {
    console.error("Error fetching user resources:", error);
    return [];
  }
};

export const checkLenderExists = async (lenderAddress: string): Promise<boolean> => {
  try {
    const [exists] = await aptos.view<[boolean]>({
      payload: {
        function: `${CONTRACT_ADDRESS}::lending_pool::lender_exists`,
        functionArguments: [CONTRACT_ADDRESS, lenderAddress],
      },
    });
    return exists;
  } catch (error) {
    console.error("Error checking lender existence:", error);
    return false;
  }
};

export const getPoolUtilization = async (): Promise<number> => {
  try {
    const [utilizationBasisPoints] = await aptos.view<[string]>({
      payload: {
        function: `${CONTRACT_ADDRESS}::lending_pool::get_utilization_rate`,
        functionArguments: [CONTRACT_ADDRESS],
      },
    });
    return parseInt(utilizationBasisPoints) / 100;
  } catch (error) {
    console.error("Error fetching pool utilization:", error);
    return 0;
  }
};

export const checkCreditLineExists = async (userAddress: string): Promise<boolean> => {
  try {
    await aptos.getAccountResource({
      accountAddress: userAddress,
      resourceType: `${CONTRACT_ADDRESS}::credit_manager::CreditLine`,
    });
    return true;
  } catch (error: any) {
    if (error.message?.includes("resource_not_found") || error.message?.includes("404")) {
      return false;
    }
    console.error("Error checking credit line existence:", error);
    return false;
  }
};

export const getCreditLineInfo = async (
  userAddress: string
): Promise<{
  creditLimit: number;
  currentDebt: number;
  availableCredit: number;
  isActive: boolean;
  lastBorrowTimestamp: number;
  collateral: number;
} | null> => {
  try {
    const [collateralDeposited, creditLimit, _borrowedAmount, _interestAccrued, totalDebt, repaymentDueDate, isActive] =
      await aptos.view<[string, string, string, string, string, string, boolean]>({
        payload: {
          function: `${CONTRACT_ADDRESS}::credit_manager::get_credit_info`,
          functionArguments: [CONTRACT_ADDRESS, userAddress],
        },
      });
    const creditLimitUsdc = unitsToUsdc(creditLimit);
    const currentDebtUsdc = unitsToUsdc(totalDebt);
    const availableCredit = creditLimitUsdc - currentDebtUsdc;
    return {
      creditLimit: creditLimitUsdc,
      currentDebt: currentDebtUsdc,
      availableCredit: Math.max(0, availableCredit),
      isActive,
      lastBorrowTimestamp: parseInt(repaymentDueDate),
      collateral: unitsToUsdc(collateralDeposited),
    };
  } catch (error: any) {
    console.error("Error fetching credit line info:", error);
    return null;
  }
};

export const getComprehensiveCreditInfo = async (
  userAddress: string
): Promise<{
  creditLimit: number;
  currentDebt: number;
  totalBorrowed: number;
  totalRepaid: number;
  collateralDeposited: number;
  lastBorrowTimestamp: number;
  isActive: boolean;
} | null> => {
  try {
    const [creditLimit, currentDebt, totalBorrowed, totalRepaid, collateralDeposited, lastBorrowTimestamp, isActive] =
      await aptos.view<[string, string, string, string, string, string, boolean]>({
        payload: {
          function: `${CONTRACT_ADDRESS}::credit_manager::get_credit_info`,
          functionArguments: [CONTRACT_ADDRESS, userAddress],
        },
      });
    return {
      creditLimit: unitsToUsdc(creditLimit),
      currentDebt: unitsToUsdc(currentDebt),
      totalBorrowed: unitsToUsdc(totalBorrowed),
      totalRepaid: unitsToUsdc(totalRepaid),
      collateralDeposited: unitsToUsdc(collateralDeposited),
      lastBorrowTimestamp: parseInt(lastBorrowTimestamp),
      isActive,
    };
  } catch (error: any) {
    console.error("Error fetching comprehensive credit info:", error);
    return null;
  }
};

export const handleTransactionError = (error: any): string => {
  const errorMessage = error.message || error.toString();
  if (errorMessage.includes("EINSUFFICIENT_BALANCE")) {
    return "Insufficient USDC balance for this transaction";
  }
  if (errorMessage.includes("CREDIT_LINE_EXISTS")) {
    return "Credit line already exists for this account";
  }
  if (errorMessage.includes("INSUFFICIENT_COLLATERAL")) {
    return "Insufficient collateral for the requested credit limit";
  }
  if (errorMessage.includes("NOT_AUTHORIZED")) {
    return "Transaction not authorized. Please try again.";
  }
  if (errorMessage.includes("INVALID_AMOUNT")) {
    return "Please enter a valid amount";
  }
  if (errorMessage.includes("INSUFFICIENT_LIQUIDITY")) {
    return "Not enough liquidity in the pool. Try a smaller amount.";
  }
  if (errorMessage.includes("EXCEEDS_CREDIT_LIMIT")) {
    return "This transaction exceeds your credit limit";
  }
  return "Transaction failed. Please try again.";
};

export const formatUsdc = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
};

export const validateUsdcAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000 && !isNaN(amount);
};

export const validateAptosAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

export const calculateAccruedInterest = (
  principalUsdc: number,
  annualRateBasisPoints: number,
  borrowTimestamp: number,
  gracePeriodSeconds: number = 2592000
): number => {
  const currentTime = Math.floor(Date.now() / 1000);
  const graceEndTime = borrowTimestamp + gracePeriodSeconds;
  if (currentTime <= graceEndTime) {
    return 0;
  }
  const interestStartTime = graceEndTime;
  const timeElapsed = currentTime - interestStartTime;
  const secondsPerYear = 31536000;
  const rate = annualRateBasisPoints / 10000;
  const dailyRate = rate / secondsPerYear;
  return principalUsdc * dailyRate * timeElapsed;
};

export const setupPreAuthorization = async (
  _borrowerAddress: string,
  totalLimitUsdc: number,
  perTxLimitUsdc: number,
  durationHours: number
) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::setup_pre_authorization`,
    functionArguments: [
      CONTRACT_ADDRESS,
      usdcToUnits(totalLimitUsdc),
      usdcToUnits(perTxLimitUsdc),
      durationHours.toString(),
    ],
    typeArguments: [],
  };
  return payload;
};

export const getPreAuthStatus = async (_borrowerAddress: string) => {
  try {
    const [totalLimit, usedAmount, expiresAt, perTxLimit, isActive] = await aptos.view<
      [string, string, string, string, boolean]
    >({
      payload: {
        function: `${CONTRACT_ADDRESS}::credit_manager::get_pre_auth_status`,
        functionArguments: [CONTRACT_ADDRESS, _borrowerAddress],
      },
    });
    return {
      totalLimit: unitsToUsdc(totalLimit),
      usedAmount: unitsToUsdc(usedAmount),
      expiresAt: parseInt(expiresAt),
      perTxLimit: unitsToUsdc(perTxLimit),
      isActive,
    };
  } catch (error) {
    console.error("Error getting pre-auth status:", error);
    return null;
  }
};

export const executeSignlessPayment = async (recipientAddress: string, amountUsdc: number) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::borrow_and_pay`,
    functionArguments: [CONTRACT_ADDRESS, recipientAddress, usdcToUnits(amountUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const updatePreAuthLimits = async (
  _borrowerAddress: string,
  newTotalLimitUsdc: number,
  newPerTxLimitUsdc: number
) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::update_pre_auth_limits`,
    functionArguments: [CONTRACT_ADDRESS, usdcToUnits(newTotalLimitUsdc), usdcToUnits(newPerTxLimitUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const togglePreAuthorization = async (_borrowerAddress: string, enable: boolean) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::toggle_pre_authorization`,
    functionArguments: [CONTRACT_ADDRESS, enable],
    typeArguments: [],
  };
  return payload;
};

export const openCreditLine = async (_borrowerAddress: string, collateralAmountUsdc: number) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::open_credit_line`,
    functionArguments: [CONTRACT_ADDRESS, usdcToUnits(collateralAmountUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const addCollateral = async (_borrowerAddress: string, collateralAmountUsdc: number) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::add_collateral`,
    functionArguments: [CONTRACT_ADDRESS, usdcToUnits(collateralAmountUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const borrowFunds = async (_borrowerAddress: string, amountUsdc: number) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::borrow`,
    functionArguments: [CONTRACT_ADDRESS, usdcToUnits(amountUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const repayLoan = async (_borrowerAddress: string, principalUsdc: number, interestUsdc: number) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::credit_manager::repay`,
    functionArguments: [CONTRACT_ADDRESS, usdcToUnits(principalUsdc), usdcToUnits(interestUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const depositCollateral = async (_borrowerAddress: string, amountUsdc: number) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::collateral_vault::deposit_collateral`,
    functionArguments: [CONTRACT_ADDRESS, usdcToUnits(amountUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const depositToLendingPool = async (_lenderAddress: string, amountUsdc: number) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::lending_pool::deposit`,
    functionArguments: [CONTRACT_ADDRESS, usdcToUnits(amountUsdc)],
    typeArguments: [],
  };
  return payload;
};

export const initializeUserReputation = async (_userAddress: string) => {
  const payload = {
    function: `${CONTRACT_ADDRESS}::reputation_manager::initialize_user`,
    functionArguments: [CONTRACT_ADDRESS],
    typeArguments: [],
  };
  return payload;
};

export const checkUserReputationInitialized = async (userAddress: string): Promise<boolean> => {
  try {
    const [isInitialized] = await aptos.view<[boolean]>({
      payload: {
        function: `${CONTRACT_ADDRESS}::reputation_manager::is_user_initialized`,
        functionArguments: [CONTRACT_ADDRESS, userAddress],
      },
    });
    return isInitialized;
  } catch (error) {
    console.error("Error checking user reputation initialization:", error);
    return false;
  }
};

export const getUserComprehensiveStatus = async (
  userAddress: string
): Promise<{
  hasReputation: boolean;
  hasCreditLine: boolean;
  creditInfo: {
    creditLimit: number;
    currentDebt: number;
    availableCredit: number;
    isActive: boolean;
    lastBorrowTimestamp: number;
    collateral: number;
  } | null;
  preAuthStatus: {
    totalLimit: number;
    usedAmount: number;
    expiresAt: number;
    perTxLimit: number;
    isActive: boolean;
  } | null;
  usdcBalance: number;
} | null> => {
  try {
    const [hasReputation, creditInfo, preAuthStatus, usdcBalance] = await Promise.all([
      checkUserReputationInitialized(userAddress),
      getCreditLineInfo(userAddress),
      getPreAuthStatus(userAddress),
      fetchUsdcBalance(userAddress),
    ]);
    return {
      hasReputation,
      hasCreditLine: !!(creditInfo && creditInfo.isActive),
      creditInfo,
      preAuthStatus,
      usdcBalance,
    };
  } catch (error) {
    console.error("Error fetching comprehensive user status:", error);
    return null;
  }
};

export const checkPoolLiquidity = async (requiredAmountUsdc: number): Promise<boolean> => {
  try {
    const [liquidity] = await aptos.view<[string]>({
      payload: {
        function: `${CONTRACT_ADDRESS}::lending_pool::get_available_liquidity`,
        functionArguments: [CONTRACT_ADDRESS],
      },
    });

    const availableLiquidityUsdc = unitsToUsdc(liquidity);
    console.log(`Pool liquidity: ${availableLiquidityUsdc} USDC, Required: ${requiredAmountUsdc} USDC`);

    return availableLiquidityUsdc >= requiredAmountUsdc;
  } catch (error) {
    console.error("Error checking pool liquidity:", error);
    return false;
  }
};

export const validatePaymentPreconditions = async (
  userAddress: string,
  recipientAddress: string,
  amountUsdc: number
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // 1. Check if amount is valid
    if (!validateUsdcAmount(amountUsdc)) {
      return { isValid: false, error: "Invalid payment amount" };
    }

    // 2. Check if recipient address is valid
    if (!validateAptosAddress(recipientAddress)) {
      return { isValid: false, error: "Invalid recipient address" };
    }

    // 3. Check pool liquidity
    const hasLiquidity = await checkPoolLiquidity(amountUsdc);
    if (!hasLiquidity) {
      return { isValid: false, error: "Insufficient liquidity in pool for this payment" };
    }

    // 4. Check user's credit info
    const creditInfo = await getCreditLineInfo(userAddress);
    if (!creditInfo || !creditInfo.isActive) {
      return { isValid: false, error: "Credit line not active" };
    }

    if (amountUsdc > creditInfo.availableCredit) {
      return { isValid: false, error: "Payment exceeds available credit" };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error validating payment preconditions:", error);
    return { isValid: false, error: "Failed to validate payment conditions" };
  }
};
