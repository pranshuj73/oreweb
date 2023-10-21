"use client";

// LIBS
import { Peer } from "peerjs";
import { useEffect, useState } from "react";
import { randomId } from "@/lib/utils";

// SHADCN COMPONENTS
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
// ICONS
import { Rocket, Files, PlugZap, ChevronsUpDown, Unplug } from "lucide-react"

// TYPES
interface fileData { fileName: string; fileUrl: string; }


export default function Home() {
  const { toast } = useToast()
  const copyId = () => {
    navigator.clipboard.writeText(peer!.id);
    toast({ title: "Copied ID", description: "Share it with others and ask them to connect!" });
  }

  const [peer, setPeer] = useState<Peer | null>(null);
  const [isReceiver, setIsReceiver] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [remoteId, setRemoteId] = useState<string | null>(null);
  const [conn, setConn] = useState<any | null>(null);
  const [files, setFiles] = useState<fileData[]>([]);
  const [remoteListIsExpanded, setRemoteListIsExpanded] = useState(true)

  useEffect(() => {
    if (peer) {
      peer.on("connection", (conn) => {
        conn.on("open", () => {
          const remoteId = conn.peer;
          setRemoteId(remoteId);
          setConn(conn);
          setIsConnected(true);
          setIsReceiver(true);
          toast({ title: `Connected to ${remoteId}`, description: "You can now share files!" });
        })
        conn.on("data", (data: any) => {          
          if (data.fileName && data.fileType && data.fileData) {
            const file = new File([data.fileData], data.fileName, { type: data.fileType });
            const fileName = data.fileName;
            const fileUrl = URL.createObjectURL(file);
            setFiles((files) => [...files, { fileName, fileUrl }]);
            toast({ title: `Received files from ${conn.peer}`, description: "Expand overview to download them!" });
          }
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
      setIsReceiver(false);
    }
  }

  const sendFiles = async () => {
    if (conn) {
      const files = document.getElementById("files") as HTMLInputElement;
      const fileList = files.files;
      if (fileList) {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const fileData = new Blob([file], { type: file.type });
          await conn.send({ fileName: file.name, fileType: file.type, fileData: fileData, })
        }
      }
    }
  }

  const disconnect = () => {
    if (conn) {
      conn.close();
      setConn(null);
      setIsConnected(false);
      setIsReceiver(false);
      setRemoteId(null);
      setFiles([]);
    }
  }

  return (
    <main className="flex min-h-dynamic h-dynamic items-center justify-center p-10 mesh-gradient overflow-hidden">
      <Card className="w-full md:w-3/4 lg:w-1/2 h-full md:min-h-3/4 lg:min-h-1/2 flex flex-col items-center p-4 bg-white/75 rounded-3xl">
        <CardHeader className={`text-center ${!isConnected ? "min-h-[50%] h-1/2" : "min-h-[33.333%] h-2/6" } flex flex-col items-center justify-end`}>
          <CardTitle className="text-4xl">Oreweb</CardTitle>
          <CardDescription>Share Your Files With Ease!</CardDescription>
        </CardHeader>
        { peer ? (
          <CardContent className="w-full h-4/6 max-w-md mt-4">
            <div className="flex items-center justify-between my-2">
              <p>Your ID: <span className="font-semibold">{peer.id}</span></p>
              <Button className="ml-4" size={"sm"} onClick={() => copyId()}>
                <Files className="h-4 w-4" />
              </Button>
            </div>
            { !isConnected ? (
              <div className="my-4">
                <Label htmlFor="remoteId">Connect to remote to send files</Label>
                <div className="flex items-center justify-between">
                  <Input id="remoteId" type="text" maxLength={5} placeholder="Remote ID" value={remoteId!} onChange={(e) => setRemoteId(e.target.value)} />
                  <Button className="ml-4" size={"sm"} disabled={!remoteId || (remoteId?.length != 5)} onClick={() => connectToRemote()}>
                    <PlugZap className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full">
                <div className="flex items-center justify-between my-2">
                  <p>Connected to <span className="font-semibold">{remoteId}</span></p>
                  <Button className="ml-4" size={"sm"} variant={"destructive"} onClick={() => disconnect()}>
                    <Unplug className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="my-6" />
                { isReceiver ? (
                  <Collapsible
                    open={remoteListIsExpanded}
                    onOpenChange={setRemoteListIsExpanded}
                    className="w-full space-y-2 h-full"
                  >
                    <div className="flex items-center justify-between space-x-4">
                      <h4 className="text-sm font-semibold">
                        Received {files.length} Files <span className={`font-normal ${remoteListIsExpanded || files.length == 0 ?"hidden" : ""}`}>(Expand To Download)</span>
                      </h4>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronsUpDown className="h-4 w-4" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    {( files.length > 0 ) ? (
                      <CollapsibleContent className="h-full">
                        <ScrollArea className="space-y-2 h-1/2 w-full">
                          {files.map((file) => (
                            <a href={file.fileUrl} download={file.fileName} className="rounded-md border px-4 py-3 font-mono text-sm block my-2"> { file.fileName } </a>
                          ))}
                        </ScrollArea>
                      </CollapsibleContent>
                    ) : (
                      <span className="rounded-md border px-4 py-2 font-mono text-sm block"> Ask your peer to share some files! </span>
                    ) }
                    
                  </Collapsible>
                ) : (
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="files">Share files</Label>
                    <Input id="files" type="file" multiple />
                    <Button size={"sm"} onClick={() => sendFiles()}> Send Selected Files <Rocket className="ml-2 h-4 w-4" /> </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        ) : (
            <Button onClick={() => connect()}><Rocket className="mr-2 h-4 w-4" />Connect to Share</Button>
        )}
      </Card>

    </main>
  )
}
