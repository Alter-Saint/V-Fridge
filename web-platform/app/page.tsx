import {Button} from "@/components/ui/button";
import { AddProducts } from "@/components/add-products";
export default function DashBoard() {
  return (
    <>
    <div className="ml-64 p-4" >
      <h1 className="text-3xl font-bold flex justify-center items-center">Dashboard Page</h1>
      <section className="m-4">
        <p>Welcome to the Dashboard!</p>
      </section>
      <section className="m-10 border p-4 rounded-lg shadow-md w-180 h-120 flex flex-col items-center absolute">
       <div className="mb-4 text-center">
        <p>Here you can manage your products</p>
          <AddProducts />
       </div>
        <div>

        </div>
      </section>
    </div>
    </>
  );
}
