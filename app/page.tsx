"use client";

// LIBS
import { DataConnection, Peer } from "peerjs";
import { useEffect, useState } from "react";
import { randomId, validatePeerID } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from 'next/navigation'

// COMPONENTS
import SenderQR from "@/components/SenderQR";

// SHADCN COMPONENTS
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// ICONS
import { Rocket, Files, PlugZap, Unplug, QrCode, DownloadCloud } from "lucide-react";

// TYPES
interface fileData { fileName: string; fileUrl: string; }


export default function Home() {
  const { toast } = useToast()

  const [peer, setPeer] = useState<Peer | null>(null);
  const [isReceiver, setIsReceiver] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [remoteId, setRemoteId] = useState<string | null>(null);
  const [conn, setConn] = useState<DataConnection | null>(null);
  const [files, setFiles] = useState<fileData[]>([]);
  const searchParams = useSearchParams()
  


  useEffect(() => {
    if (peer) {
      peer.on("disconnected", (id: string) => { setPeer(null); disconnect(); });
      peer.on("error", (err) => {
        toast({ title: "Error", description: "An error occured. Please try again!" });
        setPeer(null);
        disconnect();
      });
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
            // generate toast with appropriate message asking users to download the files
            toast({ title: `Received ${fileName} from ${conn.peer}`, description: "Download your files from the overview!" });
          }
        });
        conn.on("close", () => {
          const prevID = remoteId;
          console.log("a peer got disconnected");
          toast({ title: `Connection Lost! ${conn.peer}`, description: "Please try reconnecting with remote again!" });
          disconnect();
        })
        conn.on("error", (err) => {
          console.log(err)
          toast({ title: "Error", description: "An error occured. Please try again!" });
          disconnect();
        })
      });
    }
  }, [peer, conn]);
  
  const copyId = () => {
    navigator.clipboard.writeText(peer!.id);
    toast({ title: "Copied ID", description: "Share it with others and ask them to connect!" });
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`https://oreweb.vercel.app/?rem=${peer!.id.toString()}`);
    toast({ title: "Copied Link", description: "Share it with others and ask them to connect!" });
  }
  
  const connect = (asReceiver: boolean = true) => {
    var peer = new Peer(randomId());
    setPeer(peer);
    setIsReceiver(asReceiver);
  }

  const connectToRemote = (remoteID: string) => {
    if (peer) {
      console.log("connecting....")
      const conn_ = peer.connect(remoteID);
      console.log("connected hopefully....")
      setConn(conn_);
      setIsConnected(true);
      setIsReceiver(false);
      console.log(conn_)
    }
  }

  const sendFiles = async () => {
    if (conn) {
      const files = document.getElementById("files") as HTMLInputElement;
      const fileList = files.files;
      if (fileList && fileList.length > 0) {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const fileData = new Blob([file], { type: file.type });
          await conn.send({ fileName: file.name, fileType: file.type, fileData: fileData, })
        }
        toast({ title: `Sent ${fileList.length} files to ${conn.peer}`, description: "Ask them to download it now!" });
      }
    }
  }

  const disconnect = () => {
    if (conn) {
      conn.close();
      setConn(e=>null);
      setIsConnected(e=>false);
      // setIsReceiver(e=>false);
      setRemoteId(e=>null);
      setFiles(e=>[]);
    }
  }

  useEffect(() => {
    const remID = searchParams.get('rem')
    if (remID && validatePeerID(remID!)) {
      connect(false);  // connect as sender
      setRemoteId(remID);
    } else {
      toast({ title: "Error", description: "Invalid Remote ID! Please try again!" })
    }
  }, [])

  return (
    <main className="flex min-h-dynamic h-dynamic items-center justify-center p-4 sm:p-8 md:p-10 mesh-gradient">
      <Card className="w-full md:w-3/4 lg:w-1/2 h-full max-h-full flex flex-col items-center p-4 bg-white/75 rounded-3xl">
        <CardHeader className={`text-center ${!peer ? "min-h-[50%] h-1/2 mt-4" : "min-h-[33.333%] h-1/3" } flex flex-col items-center justify-end`}>
          <CardTitle>
            <svg className="h-auto max-w-[350px] w-full" width="852" height="165" viewBox="0 0 852 165" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M178.035 131.641V32.2409H221.995C226.568 32.2409 230.768 33.1742 234.595 35.0409C238.515 36.9076 241.875 39.4276 244.675 42.6009C247.568 45.7742 249.761 49.3209 251.255 53.2409C252.841 57.1609 253.635 61.1742 253.635 65.2809C253.635 69.4809 252.888 73.5409 251.395 77.4609C249.995 81.2876 247.941 84.6476 245.235 87.5409C242.528 90.4342 239.355 92.6742 235.715 94.2609L258.395 131.641H237.115L216.675 98.3209H197.355V131.641H178.035ZM197.355 81.3809H221.575C224.001 81.3809 226.148 80.6809 228.015 79.2809C229.881 77.7876 231.375 75.8276 232.495 73.4009C233.615 70.9742 234.175 68.2676 234.175 65.2809C234.175 62.1076 233.521 59.3542 232.215 57.0209C230.908 54.5942 229.228 52.6809 227.175 51.2809C225.215 49.8809 223.068 49.1809 220.735 49.1809H197.355V81.3809ZM384.96 114.701V131.641H315.94V32.2409H383.7V49.1809H335.26V73.1209H377.12V88.8009H335.26V114.701H384.96ZM478.842 32.5209H496.762L508.102 65.4209L519.582 32.5209H537.362L520.282 77.7409L532.882 109.381L561.022 32.2409H582.022L542.262 131.641H525.602L508.102 89.9209L490.742 131.641H474.082L434.462 32.2409H455.182L483.462 109.381L495.782 77.7409L478.842 32.5209ZM706.025 114.701V131.641H637.005V32.2409H704.765V49.1809H656.325V73.1209H698.185V88.8009H656.325V114.701H706.025ZM845.967 106.021C845.967 111.621 844.52 116.334 841.627 120.161C838.734 123.894 834.814 126.741 829.867 128.701C825.014 130.661 819.694 131.641 813.907 131.641H765.887V32.2409H819.087C823.754 32.2409 827.767 33.5009 831.127 36.0209C834.58 38.4476 837.194 41.6209 838.967 45.5409C840.834 49.3676 841.767 53.3809 841.767 57.5809C841.767 62.3409 840.554 66.8676 838.127 71.1609C835.7 75.4542 832.154 78.6276 827.487 80.6809C833.18 82.3609 837.66 85.3942 840.927 89.7809C844.287 94.1676 845.967 99.5809 845.967 106.021ZM826.507 102.381C826.507 99.8609 825.994 97.6209 824.967 95.6609C823.94 93.6076 822.54 92.0209 820.767 90.9009C819.087 89.6876 817.127 89.0809 814.887 89.0809H785.207V115.261H813.907C816.24 115.261 818.34 114.701 820.207 113.581C822.167 112.368 823.707 110.781 824.827 108.821C825.947 106.861 826.507 104.714 826.507 102.381ZM785.207 48.7609V73.8209H810.967C813.114 73.8209 815.074 73.3076 816.847 72.2809C818.62 71.2542 820.02 69.8076 821.047 67.9409C822.167 66.0742 822.727 63.8342 822.727 61.2209C822.727 58.7009 822.214 56.5076 821.187 54.6409C820.254 52.7742 818.947 51.3276 817.267 50.3009C815.68 49.2742 813.86 48.7609 811.807 48.7609H785.207Z" fill="currentColor"/>
              <path d="M13.0348 52.7658C13.0348 58.3685 10.8091 63.7417 6.84746 67.7033C-1.40232 75.9531 -1.40232 89.3286 6.84746 97.5784C10.8091 101.54 13.0348 106.913 13.0348 112.516C13.0348 124.183 22.4927 133.641 34.1597 133.641C39.7624 133.641 45.1356 135.867 49.0973 139.828C57.347 148.078 70.7226 148.078 78.9724 139.828C82.9341 135.867 88.3072 133.641 93.9099 133.641C105.577 133.641 115.035 124.183 115.035 112.516C115.035 106.913 117.26 101.54 121.222 97.5785C129.472 89.3287 129.472 75.9531 121.222 67.7033C117.26 63.7416 115.035 58.3684 115.035 52.7658C115.035 41.0988 105.577 31.6409 93.9099 31.6409C88.3072 31.6409 82.934 29.4152 78.9724 25.4535C70.7226 17.2038 57.347 17.2038 49.0973 25.4535C45.1356 29.4152 39.7624 31.6409 34.1597 31.6409C22.4927 31.6409 13.0348 41.0988 13.0348 52.7658Z" fill="currentColor"/>
            </svg>
          </CardTitle>
          <CardDescription>Share Files Anonymously, Effortlessly.</CardDescription>
        </CardHeader>
        
          { !peer ? (
            <CardContent className="w-full max-w-md">
              <Button className="w-full my-1" variant={"secondary"} onClick={() => connect(false)}> Send Files<Rocket className="ml-2 h-4 w-4" /></Button>
              <Button className="w-full my-1" onClick={() => connect(true)}>Receive Files <DownloadCloud className="ml-2 h-4 w-4" /></Button>
            </CardContent>
          ) : (
            <CardContent className="w-full max-w-md">
              <div className="flex flex-wrap items-center my-2">
                <p className="mr-auto">Your ID: <span className="font-semibold">{peer.id}</span></p>
                <Button size={"sm"} onClick={() => copyId()}>
                  <Files className="h-4 w-4" />
                </Button>
                { isReceiver ? (
                  <AlertDialog>
                    <AlertDialogTrigger className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                    <QrCode className="h-4 w-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="flex flex-col items-center justify-center">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Scan Your QR Code</AlertDialogTitle>
                        <AlertDialogDescription>
                          <SenderQR value={peer ? `https://oreweb.vercel.app/?rem=${peer.id.toString()}` : "ERROR :["} />
                          <p className='text-center'>{peer.id}</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => copyLink()}>Copy Link</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null }
              </div>
              
              { isReceiver ? (
                // RECEIVER CODE
                <>
                  <span>{isConnected}</span>
                  <div className="flex items-center justify-between my-2">
                    { !isConnected ? (
                      <p>No peers have connected yet :[</p>
                    ) : (
                      <p>Connected to <span className="font-semibold">{remoteId}</span></p>
                    ) }
                    <Button className="ml-4" size={"sm"} disabled={!remoteId} variant={"destructive"} onClick={() => disconnect()}>
                      <Unplug className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator className="my-6" />
                  <div className="w-full space-y-2 h-[200px]">
                    <h4 className="text-sm font-semibold">
                      Received {files.length} Files <span className={`font-normal ${files.length == 0 ? "hidden" : ""}`}>(Click on file to download)</span>
                    </h4>
                    {( files.length > 0 ) ? (
                      <ScrollArea className="space-y-2 h-full max-h-full w-full">
                        {files.map((file) => (
                          <a href={file.fileUrl} download={file.fileName} className="text-blue-400 rounded-md border px-4 py-3 font-mono text-sm block my-2 max-w-full text-ellipsis"> { file.fileName } </a>
                        ))}

                        {/* DEBUG CODE: create a dummy array to create 30 links */}
                        {/* {Array.from(Array(30).keys()).map((i) => (
                          <a href="#" className="text-blue-500 rounded-md border px-4 py-3 font-mono text-sm block my-2 max-w-full text-ellipsis"> Dummy File {i} </a>
                        ))} */}

                      </ScrollArea>
                    ) : (
                      <span className="rounded-md border px-4 py-2 font-mono text-sm block"> Ask your peer to share some files! </span>
                    ) }
                  </div>
                </>
              ) : (
                // SENDER CODE
                <>
                { isConnected ? (
                  // CONNECTED TO REMOTE
                  <>
                    <div className="flex items-center justify-between my-2">
                      <p>Connected to <span className="font-semibold">{remoteId}</span></p>
                      <Button className="ml-2" size={"sm"} variant={"destructive"} onClick={() => disconnect()}>
                        <Unplug className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator className="my-6" />
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="files">Share files</Label>
                      <Input id="files" type="file" multiple />
                      <Button size={"sm"} onClick={() => sendFiles()}> Send Selected Files <Rocket className="ml-2 h-4 w-4" /> </Button>
                    </div>
                  </>
                ) : (
                  // NOT CONNECTED TO REMOTE
                  <>
                    <Label htmlFor="remoteId">Connect to remote to send files</Label>
                    <div className="flex items-center justify-between">
                      <Input id="remoteId" type="text" maxLength={5} placeholder="Remote ID" value={remoteId || ""} onChange={(e) => setRemoteId(e.target.value)} />
                      <Button className="ml-2" size={"sm"} disabled={!remoteId || (remoteId?.length != 5)} onClick={() => remoteId && connectToRemote(remoteId)}>
                        <PlugZap className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )} 
                </>
              ) }
            </CardContent>
          ) }

        <CardFooter className="flex items-center flex-wrap justify-center mt-auto text-xs">
          Made by <Link className="mx-1 text-blue-500" target={"_blank"} rel={"noopener noreferrer"} href={"https://twitter.com/pranshuj73"}>@pranshuj73</Link> with <span className="text-red-500 ml-1">❤</span>
        </CardFooter>
      </Card>

    </main>
  )
}
