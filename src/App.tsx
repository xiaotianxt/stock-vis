import StockChart from "./StockChart";
import MessageBox from "./MessageBox";

function App() {
  return (
    <>
      <div className="fixed top-2 w-full text-center text-slate-100 text-xl font-bold p-2 bg-slate-900 opacity-70">
        股票可视化 —— 房地产行业 20 年大事纪
      </div>
      <StockChart />
      <MessageBox />
    </>
  );
}

export default App;
