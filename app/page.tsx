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
import { Rocket, Files, PlugZap, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";

interface fileData {
  fileName: string;
  fileUrl: string;
}

export default function Home() {
  const { toast } = useToast()
  const copyId = () => {
    navigator.clipboard.writeText(peer!.id);
    toast({ title: "Copied ID", description: "Share it with others and ask them to connect!" });
  }

  const [peer, setPeer] = useState<Peer | null>(null);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [remoteId, setRemoteId] = useState<string | null>(null);
  const [conn, setConn] = useState<any | null>(null);
  const [files, setFiles] = useState<fileData[]>([]);
  const [name, setName] = useState<string | null>(null);

  const [remoteListIsExpanded, setRemoteListIsExpanded] = useState(false)

  useEffect(() => {
    if (peer) {
      peer.on("connection", (conn) => {
        conn.on("open", () => {
          const remoteId = conn.peer;
          setRemoteId(remoteId);
          setConn(conn);
          setIsConnected(true);
          toast({ title: `Connected to ${remoteId}`, description: "You can now share files!" });
        })
        conn.on("data", (data: any) => {
          console.log("receiving...")
          console.log(files)
          if (data.fileName && data.fileData) {
            const file = new Blob([data.fileData], { type: data.fileType });
            const fileName = data.fileName;
            const fileUrl = URL.createObjectURL(file);
            setFiles([...files, { fileName, fileUrl }]);
          }


          // toast({ title: data})
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
    }
  }

  const sendFiles = () => {
    if (conn) {
      const files = document.getElementById("files") as HTMLInputElement;
      if (files.files) {
        for (let i = 0; i < files.files.length; i++) {
          const fileData = files.files[i];
          const fileName = fileData.name;
          const fileType = fileData.type;
          conn.send({ fileData, fileName, fileType });
        }
      }
    }
  }

  return (
    <main className="flex min-h-screen h-screen items-center justify-center p-10 bg-lime-200">
      <Card className="w-full md:w-3/4 lg:w-1/2 h-full md:min-h-3/4 lg:min-h-1/2 flex flex-col items-center justify-center p-4">
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
                  <Button className="ml-4" size={"sm"} disabled={!remoteId || (remoteId?.length != 5)} onClick={() => connectToRemote()}>
                    <PlugZap className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm">Connected to <span className="font-semibold">{remoteId}</span></p>
                <Collapsible
                  open={remoteListIsExpanded}
                  onOpenChange={setRemoteListIsExpanded}
                  className="w-[350px] space-y-2"
                >
                  <div className="flex items-center justify-between space-x-4">
                    <h4 className="text-sm font-semibold">
                      Received 10 Files
                    </h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  {(files.length > 0) ? (
                    <CollapsibleContent className="space-y-2">
                      {files.map((file) => (
                        <a className="rounded-md border px-4 py-3 font-mono text-sm w-full" href={file.fileUrl}>
                          { file.fileName }
                        </a>
                      ))}
                    </CollapsibleContent>
                  ) : (
                    <div className="rounded-md border px-4 py-2 font-mono text-sm">
                      No files received yet!
                    </div>
                  ) }
                  
                </Collapsible>
                <Separator className="my-6" />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="files">Share files</Label>
                  <Input id="files" type="file" multiple />
                  {/* send button */}
                  <Button size={"sm"} onClick={() => sendFiles()}>
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
