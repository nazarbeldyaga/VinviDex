import { ethers } from 'ethers';
import ERC20_ABI from '@/constants/abis/erc20.json'; // Додайте ABI ERC20
import UNISWAP_ROUTER_ABI from '@/constants/abis/uniswapRouter.json';

export const fetchTokenBalances = async (
  tokenAddresses: Record<string, string>, // напр: { USDT: "0x...", USDC: "0x..." }
  provider: ethers.providers.Web3Provider,
  account: string
): Promise<Record<string, string>> => {
  const balances: Record<string, string> = {};
  
  try {
    // Get all token symbols
    const symbols = Object.keys(tokenAddresses);
    
    // Process each token
    for (const symbol of symbols) {
      try {
        if (symbol === "ETH") {
          // For ETH, use getBalance instead of balanceOf
          const balance = await provider.getBalance(account);
          balances[symbol] = ethers.utils.formatEther(balance);
        } else {
          // For ERC20 tokens
          const tokenAddress = tokenAddresses[symbol];
          const tokenContract = new ethers.Contract(
            tokenAddress,
            [
              "function balanceOf(address owner) view returns (uint256)",
              "function decimals() view returns (uint8)"
            ],
            provider
          );
          
          // Get token decimals and balance
          const decimals = await tokenContract.decimals();
          const balance = await tokenContract.balanceOf(account);
          
          // Format the balance according to token decimals
          balances[symbol] = ethers.utils.formatUnits(balance, decimals);
        }
      } catch (error) {
        console.error(`Помилка отримання балансу для ${symbol}:`, error);
        balances[symbol] = "0.00";
      }
    }
    
    return balances;
  } catch (error) {
    console.error("Помилка отримання балансів токенів:", error);
    return {};
  }
};

interface addLiquidityParams {
  token0: string;
  token1: string;
  amount0: string;
  amount1: string;
  amount0Min?: string;
  amount1Min?: string;
  deadline?: number;
  recipient: string;
}

export const addLiquidity = async (
    params: addLiquidityParams,
    provider: ethers.providers.Web3Provider
): Promise<any> => {
  const signer = provider.getSigner();
  const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const router = new ethers.Contract(routerAddress, UNISWAP_ROUTER_ABI, signer);

  const token0Contract = new ethers.Contract(params.token0, ERC20_ABI, signer);
  const token1Contract = new ethers.Contract(params.token1, ERC20_ABI, signer);

  const amount0 = ethers.utils.parseUnits(params.amount0, await token0Contract.decimals());
  const amount1 = ethers.utils.parseUnits(params.amount1, await token1Contract.decimals());

  const amount0Min = params.amount0Min
      ? ethers.utils.parseUnits(params.amount0Min, await token0Contract.decimals())
      : amount0.mul(95).div(100); // 5% слайпейдж
  const amount1Min = params.amount1Min
      ? ethers.utils.parseUnits(params.amount1Min, await token1Contract.decimals())
      : amount1.mul(95).div(100);

  const deadline = params.deadline ?? Math.floor(Date.now() / 1000) + 60 * 10;

  // Дозвіл токенів
  const allowance0 = await token0Contract.allowance(await signer.getAddress(), routerAddress);
  if (allowance0.lt(amount0)) {
    await token0Contract.approve(routerAddress, amount0);
  }

  const allowance1 = await token1Contract.allowance(await signer.getAddress(), routerAddress);
  if (allowance1.lt(amount1)) {
    await token1Contract.approve(routerAddress, amount1);
  }

  // Додаємо ліквідність
  const tx = await router.addLiquidity(
      params.token0,
      params.token1,
      amount0,
      amount1,
      amount0Min,
      amount1Min,
      params.recipient,
      deadline
  );

  const receipt = await tx.wait();

  return {
    success: receipt.status === 1,
    transactionHash: receipt.transactionHash,
    gasUsed: receipt.gasUsed.toString(),
    blockNumber: receipt.blockNumber,
  };
};

interface AddLiquidityETHParams {
  tokenAddress: string; // адреса ERC-20 токена
  tokenAmount: string;  // кількість токенів (наприклад "1.5")
  ethAmount: string;    // кількість ETH (наприклад "0.1")
  recipient: string;    // адреса одержувача LP-токенів
  tokenAmountMin?: string; // мін. кількість токенів для слайпейджу (за замовчуванням 95%)
  ethAmountMin?: string;   // мін. кількість ETH для слайпейджу
  deadline?: number;       // UNIX timestamp (за замовчуванням +10 хв)
}

export const addLiquidityETH = async (
    params: AddLiquidityETHParams,
    provider: ethers.providers.Web3Provider
): Promise<any> => {
  const signer = provider.getSigner();
  const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // UniswapV2Router02 (Ethereum Mainnet)
  const router = new ethers.Contract(routerAddress, UNISWAP_ROUTER_ABI, signer);
  const token = new ethers.Contract(params.tokenAddress, ERC20_ABI, signer);

  const decimals = await token.decimals();
  const tokenAmount = ethers.utils.parseUnits(params.tokenAmount, decimals);
  const ethAmount = ethers.utils.parseEther(params.ethAmount);

  const tokenAmountMin = params.tokenAmountMin
      ? ethers.utils.parseUnits(params.tokenAmountMin, decimals)
      : tokenAmount.mul(95).div(100);

  const ethAmountMin = params.ethAmountMin
      ? ethers.utils.parseEther(params.ethAmountMin)
      : ethAmount.mul(95).div(100);

  const deadline = params.deadline ?? Math.floor(Date.now() / 1000) + 60 * 10;

  // Схвалення витрати токенів для роутера
  const allowance = await token.allowance(await signer.getAddress(), routerAddress);
  if (allowance.lt(tokenAmount)) {
    const approveTx = await token.approve(routerAddress, tokenAmount);
    await approveTx.wait();
  }

  // Виклик addLiquidityETH
  const tx = await router.addLiquidityETH(
      params.tokenAddress,
      tokenAmount,
      tokenAmountMin,
      ethAmountMin,
      params.recipient,
      deadline,
      {
        value: ethAmount, // ETH як msg.value
      }
  );

  const receipt = await tx.wait();

  return {
    success: receipt.status === 1,
    transactionHash: receipt.transactionHash,
    gasUsed: receipt.gasUsed.toString(),
    blockNumber: receipt.blockNumber,
  };
};