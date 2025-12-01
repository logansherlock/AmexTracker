import Form from "../components/form";
import "../index.css";
import "../output.css";
import Header from "../components/header";

export default function AddCard() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <Form />
    </div>
  );
}