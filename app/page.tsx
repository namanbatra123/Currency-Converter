"use client";
import React, { useState, useEffect } from "react";

interface CurrencyPair {
  pair: string;
  originalPrice: number;
  price: number;
}

const initialTableData: CurrencyPair[] = [
  { pair: "EUR/USD", originalPrice: 1.05, price: 1.05 },
  { pair: "USD/INR", originalPrice: 80.05, price: 80.05 },
  { pair: "AUD/USD", originalPrice: 0.67, price: 0.67 },
];

const Home: React.FC = () => {
  const [sourceCurrency, setSourceCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("INR");
  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [tableData, setTableData] = useState<CurrencyPair[]>(initialTableData);

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = tableData.map((data) => {
        const fluctuation = data.originalPrice * (1 + (Math.random() * 6 - 3) / 100);
        return { ...data, price: parseFloat(fluctuation.toFixed(2)) };
      });
      setTableData(newData);
    }, 1000);

    return () => clearInterval(interval);
  }, [tableData]);

  const exchangeRates = (source: string, target: string): number | null => {
    if (source === target) return 1;
  
    const sourceToBase = source === "USD" ? 1 : tableData.find(data => data.pair === `${source}/USD`)?.price;
    const baseToTarget = target === "USD" ? 1 : tableData.find(data => data.pair === `USD/${target}`)?.price;
  
    if (!sourceToBase || !baseToTarget) {
      const baseToSource = source === "USD" ? 1 : tableData.find(data => data.pair === `USD/${source}`)?.price;
      const targetToBase = target === "USD" ? 1 : tableData.find(data => data.pair === `${target}/USD`)?.price;

  
      if (baseToSource && targetToBase) {
        return (1 / baseToSource) * (1 / targetToBase);
      } else {
        return null;
      }
    }  
    return sourceToBase * baseToTarget;
  };
  

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSourceCurrency(e.target.value);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setTargetCurrency(e.target.value);
  };

  const calculateConversion = (): void => {
    const rate = exchangeRates(sourceCurrency, targetCurrency);
    if (rate !== null) {
      const result = rate * parseFloat(amount);
      setConvertedAmount(parseFloat(result.toFixed(2)));
    }
  };

  return (
    <div className="bg-white h-full lg:h-screen py-20 grid grid-cols-1 lg:grid-cols-2 gap-y-20 items-center justify-items-center">
      {/* Left side */}
      <div className="bg-[#0A0634] h-[317px] lg:h-[597px] w-[523px] flex flex-col items-center justify-start p-4">
        <h1 className="text-white font-bold text-xl mb-4">Markets</h1>
        <table>
          <tbody>
            {tableData.map(({ pair, price }, index) => (
              <tr className="bg-[#828282]" key={index}>
                <td className="text-white p-2 border-2 w-[200px] text-left">{pair}</td>
                <td className="text-white p-2 border-2 w-[100px] text-right">{price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right side */}
      <div className="bg-[#CCCCCC] h-[597px] w-[523px] flex flex-col items-center p-4">
        <h1 className="text-black font-bold text-xl mb-4">
          Currency Converter
        </h1>
        <div className="w-full max-w-xs">
          <div className="mb-4">
            <h2 className="text-black mb-2">Source Currency</h2>
            <select
              onChange={handleSourceChange}
              value={sourceCurrency}
              className="w-full p-2 text-black"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="AUD">AUD</option>
            </select>
          </div>

          <div className="mb-4">
            <h2 className="text-black mb-2">Target Currency</h2>
            <select
              onChange={handleTargetChange}
              value={targetCurrency}
              className="w-full p-2 text-black"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="AUD">AUD</option>
            </select>
          </div>

          <div className="mb-4">
            <h2 className="text-black mb-2">Amount</h2>
            <input
              type="number"
              className="w-full text-black p-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>


          
          <div className="bg-white mt-8 p-4">
            <h2 className="text-black flex text-sm">
              Estimated Converted Amount: <p className="text-[#0F7E0D]">{convertedAmount}</p>
            </h2>
          </div>

          <button
            className="bg-white text-black mt-8 p-2 w-full cursor-pointer font-bold"
            onClick={calculateConversion}
          >
            Exchange
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
