const CORE = [
  "BTC","ETH","BNB","SOL","XRP","ADA","AVAX","DOGE","MATIC","DOT","LINK","UNI","ATOM","LTC","ETC","XLM","ALGO","NEAR","FTM","SAND",
  "APE","MANA","ENJ","CHZ","AXS","GALA","IMX","LRC","ZIL","THETA","VET","HBAR","ICP","FIL","EOS","AAVE","COMP","SNX","CRV","MKR",
  "1INCH","SUSHI","YFI","BAL","REN","KNC","ZRX","BAT","GRT","OCEAN","ARB","OP","SUI","APT","INJ","TIA","SEI","WLD","BLUR","PEPE",
  "FLOKI","SHIB","BONK","WIF","BOME","ORDI","SATS","RATS",
] as const;

const EXTENDED = [
  "TRX","BCH","XMR","QNT","EGLD","XTZ","RUNE","KAS","FLOW","MNT","JUP","PYTH","JTO","LDO","STX","RPL","FXS","DYDX","GMX","PENDLE",
  "SFP","HOT","ANKR","IOTA","KAVA","ROSE","CELO","MINA","RNDR","TAO","AKT","AGIX","FET","OXT","DASH","ZEC","WAVES","KSM","WOO","CTSI",
  "SKL","DUSK","API3","LQTY","SSV","MASK","NTRN","CYBER","ARKM","ID","PORTAL","AEVO","ALT","STRK","JASMY","CFX","KLAY","ONT","ICX","AR",
  "SAGA","NOT","TON","ZETA","MEME","BIGTIME","MAGIC","GMT","CEEK","HOOK","XVG","USTC","LUNA","ASTR","CHR","COTI","MTL","RLC","STORJ","BAND",
  "NKN","RVN","SC","DENT","CELR","KDA","ZEN","GNO","NMR","C98","BICO","FIDA","ALPHA","RSR","TRB","VANRY","SUPER","LIT","TWT","SXP",
  "XAI","DYM","MANTA","PIXEL","METIS","AUDIO","1000PEPE","1000BONK","1000FLOKI","ACH","AMP","ARPA","AUCTION","BAKE","BNT","CVC","DODO","EDU","FLUX","GLMR",
  "HIGH","ILV","JOE","KP3R","LEVER","LOKA","LPT","LQTY","MDT","MULTI","NEXO","NULS","OGN","OM","PERP","PHA","POLYX","QI","RAD","RIF",
  "SNT","SPELL","STEEM","STG","SYN","UMA","UST","UTK","VTHO","XNO","YGG","ZEN","TOMO","TRU","BLZ","BTS","CSPR","DIA","EWT","FORTH",
  "GHST","GTC","HIFI","IDEX","KNC","LINA","MBOX","NEO","OG","POLS","PROM","QKC","REQ","SLP","STMX","SYS","TLM","UFT","VOXEL","WRX",
] as const;

export const TOP_200_SYMBOLS = Array.from(new Set([...CORE, ...EXTENDED])).slice(0, 220);

export function toPerpSymbol(asset: string, exchange: "hyperliquid" | "binance" | "okx" | "bybit"): string {
  return exchange === "hyperliquid" ? `${asset}/USDC:USDC` : `${asset}/USDT`;
}
