"use client";
// The usage -
import { Peer } from "peerjs";
import { useEffect, useState } from "react";
import { randomId } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Files, PlugZap } from "lucide-react"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label";



export default function Home() {
  const { toast } = useToast()
  const copyId = () => {
    navigator.clipboard.writeText(peer!.id);
    toast({ title: "Copied ID", description: "Share it with others and ask them to connect!" });
  }

  const [peer, setPeer] = useState<Peer | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [remoteId, setRemoteId] = useState<string | null>(null);
  const [conn, setConn] = useState<any | null>(null);
  // const [remotePeer, setRemotePeer] = useState<Peer | null>(null);

  useEffect(() => {
    if (peer) {
      peer.on("connection", (conn) => {
        conn.on("open", () => {
        })
        conn.on("data", (data: any) => {
          console.log("receiving...")
          toast({ title: data})
        });
      });
    }
  }, [peer]);

  const connect = () => {
    var peer = new Peer(randomId());
    setPeer(peer);
  }

  const connectToRemote = () => {
    if (peer) {
      const conn_ = peer.connect(remoteId!);
      setConn(conn_);
      setIsConnected(true);
      conn_.on("open", () => {
        toast({ title: `Connected to ${remoteId}`, description: "You can now share files!" });
        conn_.send(`${peer.id} says hi!`);
      });
    }
  }

  return (
    <main className="flex min-h-screen h-screen flex-col items-center justify-center p-10 bg-lime-200">
      <Card className="w-full md:w-3/4 lg:w-1/2 h-full md:h-3/4 lg:h-1/2 flex flex-col items-center justify-center">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">Oreweb</CardTitle>
          <CardDescription>Share Your Files With Ease!</CardDescription>
        </CardHeader>
        { peer ? (
          <CardContent className="w-full max-w-md">
            <div className="flex items-center justify-between my-4">
              <p>Your ID: <span className="font-semibold">{peer.id}</span></p>
              <Button className="ml-4" size={"sm"} onClick={() => copyId()}>
                <Files className="h-4 w-4" />
              </Button>
            </div>

            { !isConnected ? (
              <>
                <Label htmlFor="remoteId">Connect to Remote</Label>
                <div className="flex items-center justify-between">
                  <Input id="remoteId" type="text" maxLength={5} placeholder="Remote ID" value={remoteId!} onChange={(e) => setRemoteId(e.target.value)} />
                  <Button className="ml-4" size={"sm"} onClick={() => connectToRemote()}>
                    <PlugZap className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>Connected to <span className="font-semibold">{remoteId}</span></p>

                <div className="grid w-full max-w-sm items-center gap-1.5 pt-6">
                  <Label htmlFor="files">Share files</Label>
                  <Input id="files" type="file" multiple />
                  {/* send button */}
                  <Button size={"sm"} onClick={() => {}}>
                    Send Selected Files
                    <Rocket className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            
          </CardContent>
        ) : (
            <Button onClick={() => connect()}><Rocket className="mr-2 h-4 w-4" />Connect to Share</Button>
        ) }
      </Card>

    </main>
  )
}
