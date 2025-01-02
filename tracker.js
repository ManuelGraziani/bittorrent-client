import dgram from "dgram";
import { Buffer } from "buffer";

export default function getPeers(torrent, callback) {
  const socket = dgram.createSocket("udp4");
  const url = torrent.announce.toString('utf8')
    // Send connect request
    udpSend(socket, buildConnReq(), url);

  socket.on("message", (response) => {
    if (respType(response) === "connect") {
      // Receive and parse connect response
      const connRep = parseConnResp(response);
      // Send announce request
      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceReq, url);
    } else if (respType(response) === "announce") {
      // parse announce response
      const announceResp = parseAnnounceResp(response);
      // pass peers to callback
      callback(announceResp.peers);
    }
  });
}

function udpSend(socket, message, rawUrl, callback = () => {}) {
  const url = new URL(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

function respType(resp) {}

function buildConnReq() {}

function parseConnResp(resp) {}

function buildAnnounceReq(connId) {}

function parseAnnounceResp(resp) {}
