import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

//存放所有连接的用户
const connections: WebSocket[] = []

const messageList: {
	userId: string
	userName: string
	message: string
}[] = []

wss.on('connection', (ws: WebSocket) => {
	connections.push(ws)
	ws.on('message', (jsonMessage: string) => {
		if (JSON.parse(jsonMessage)?.type === 'list') {
			if (messageList.length > 0) ws.send(JSON.stringify(messageList))
		} else {
			const { userId, userName, message } = JSON.parse(jsonMessage)
			console.log('received: %s', userId, userName, message)
			messageList.push({ userId, userName, message })
			broadcast(JSON.stringify(messageList))
		}
	})
	// ws.on('open', () => {
	// 	ws.send(JSON.stringify(messageList))
	// })
})

function broadcast(msg: any) {
	// 群发消息给所有用户
	connections.forEach((item) => {
		item.send(msg)
	})
}

//start our server
server.listen(process.env.PORT || 8999, () => {
	// @ts-ignore
	console.log(`Server started on port ${server?.address()?.port} :)`)
})
