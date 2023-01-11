import { useEventLoader } from "./event-loader";

export const Index = () => {
  const { event } = useEventLoader();
  return (
    <div className="m-4 p-4 w-[35%] fixed bottom-0 left=0 text-slate-100 bg-slate-900 opacity-80">
      <div className="title flex text-xl font-extrabold justify-between mb-4">
        <div className="title">{event?.title}</div>
        <div className="time">{event?.date}</div>
      </div>
      <div className="content text-slate-100 opacity-80">{event?.content}</div>
    </div>
  );
};

export default Index;
