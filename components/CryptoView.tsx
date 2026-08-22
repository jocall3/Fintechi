import React, { useContext, useMemo, useState } from 'react';
import Card from './Card';
import { DataContext } from '../context/DataContext';
import { CryptoAsset, NFTAsset } from '../types';
import { ResponsiveContainer, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';

const CryptoView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("CryptoView must be within a DataProvider.");
    
    const { cryptoAssets, paymentOperations, walletInfo, virtualCard, connectWallet, issueCard, buyCrypto, nftAssets, mintNFT, mintToken, initiatePayment } = context;

    const [buyAmount, setBuyAmount] = useState('1000');
    
    const totalCryptoValue = cryptoAssets.reduce((acc, asset) => acc + asset.value, 0);

    const chartData = useMemo(() => cryptoAssets.map(a => ({ ...a })), [cryptoAssets]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Crypto Portfolio" className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="h-64">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius="80%" fill="#8884d8" dataKey="value" nameKey="ticker">
                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Value</p>
                            <p className="text-4xl font-bold text-white">${totalCryptoValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </Card>
                <Card title="Actions">
                    <div className="space-y-3">
                         {!walletInfo && <button onClick={connectWallet} className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">Connect Web3 Wallet</button>}
                         {walletInfo && !virtualCard && <button onClick={issueCard} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Issue Virtual Card</button>}
                         {walletInfo && <button onClick={() => buyCrypto(parseFloat(buyAmount), 'BTC')} className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Buy Crypto</button>}
                    </div>
                </Card>
            </div>
            <Card title="Your Assets">
                <div className="space-y-2">
                    {cryptoAssets.map((asset: CryptoAsset) => (
                        <div key={asset.ticker} className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: asset.color }}></div>
                                <div>
                                    <p className="font-semibold text-white">{asset.name} ({asset.ticker})</p>
                                    <p className="text-sm text-gray-400 font-mono">{asset.amount.toFixed(4)}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-white font-mono">${asset.value.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </Card>
            <Card title="Your NFT Collection">
                {nftAssets.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {nftAssets.map((nft: NFTAsset) => (
                            <div key={nft.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50">
                                <img src={nft.imageUrl} alt={nft.name} className="w-full h-32 object-cover" />
                                <div className="p-3">
                                    <h5 className="text-sm font-semibold text-white truncate">{nft.name}</h5>
                                    <p className="text-xs text-gray-400 mt-1 truncate">{nft.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">You haven't minted any NFTs yet. Mint a post from the Ecosystem Hub to start your collection!</p>
                )}
            </Card>
        </div>
    );
};

export default CryptoView;
