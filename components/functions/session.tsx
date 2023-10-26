import Peer, { DataConnection } from "peerjs"
import { Dispatch, SetStateAction, useState } from "react";

// class Log{

//     constructor(){

//     }
//     static info(){
//         console.log("[INFO]")
//     }
// }

interface MessageData {
        userId: string,
        name: string,
        file: FileList,
}

/**
 * Function to create and manage sessions
 */
class Session {

    // state variables
    peer: Peer
    connections: DataConnection[]
    setConnections: Dispatch<SetStateAction<DataConnection[]>>
    data: MessageData[]
    setData: Dispatch<SetStateAction<MessageData[]>>

    // 
    listeningConnections: string[] = []
    constructor(peer: Peer){
        this.peer = peer;
        [this.connections, this.setConnections] = useState<DataConnection[]>([]);
        [this.data, this.setData] = useState<MessageData[]>([]);
    }

    listenForConnection() {
        this.peer.on("connection", (conn:DataConnection) => {
            if(this.connections.map(each=>each.connectionId).some(each => each == conn.connectionId)){
                console.log("A new connection is created", conn.connectionId);
                this.setConnections(prev=>[conn, ...prev]) // [...prev, hello]
                this.listenForData();
            }
        })
    }

    listenForData(){
        const newConnections = this.connections.filter(each => {
            return !(this.listeningConnections.some(connId=>connId == each.connectionId))
        })

        console.log("found new connections!!\n listening for data...")
        for(let i = 0; i < newConnections.length; i++){
            const currentConn = newConnections[i];
            currentConn.on("data", (data)=>{
                this.setData(prev=>[...prev, {
                    file: data as FileList, // ERROR: please modify this line
                    name: "",
                    userId: currentConn.connectionId,
                }])
            })
        }
    }

    getSessionId(){
        return this.peer.id;
    }

}