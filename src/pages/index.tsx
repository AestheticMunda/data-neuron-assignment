import { Inter } from "next/font/google";
import IdeClone from "@/components/IdeClone";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  
  return (
    <div>
      <IdeClone/>
    </div>
  );
}
