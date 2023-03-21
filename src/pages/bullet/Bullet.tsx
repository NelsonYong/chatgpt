import MessageItem from '@/components/MessageItem'
import { createEffect, createSignal, Index, onMount } from 'solid-js'
import { useWebSocket } from 'solidjs-use'
import { v4 as uuidv4 } from 'uuid'

const Bullet = () => {
	const [nameD, setNameD] = createSignal(true)
	let currentUser: { userName: string; userId: string }
	let nameInputRef: HTMLTextAreaElement
	let systemInputRef: HTMLTextAreaElement

	const { status, data, send, open, close } = useWebSocket(
		'ws://10.0.88.79:8999',
		{
			autoReconnect: {
				retries: 3,
				delay: 1000,
				onFailed() {
					alert('Failed to connect WebSocket after 3 retries')
				},
			},
		}
	)

	createEffect(() => {
		if (status() === 'OPEN') {
			send(JSON.stringify({ type: 'list' }))
		}
	})

	onMount(() => {
		currentUser = JSON.parse(localStorage.getItem('user'))
		setNameD(!!currentUser)
		if (!!currentUser) {
			nameInputRef.value = currentUser.userName
		}
	})

	createEffect(() => {
		console.log(nameD())
	})

	const handleButtonClick = () => {
		currentUser = JSON.parse(localStorage.getItem('user'))
		if (!currentUser) {
			const userInfo = {
				userId: (uuidv4() as string).slice(0, 26),
				userName: nameInputRef.value,
			}
			localStorage.setItem('user', JSON.stringify(userInfo))
			send(JSON.stringify({ ...userInfo, message: systemInputRef.value }))
		}
		// 设置本地缓存
		else {
			send(JSON.stringify({ ...currentUser, message: systemInputRef.value }))
		}
		setNameD(true)
	}

	return (
		<div>
			<div>
				<Index each={data() ? JSON.parse(data()) : []}>
					{(message, index) => (
						<>
							<MessageItem
								role={'user'}
								message={`${message().userName}:\t ${message().message}`}
							/>
						</>
					)}
				</Index>
			</div>
			<div>
				<div class="fi gap-1 op-50 dark:op-60">
					<span>昵称:</span>
				</div>
				<div class="mt-2">
					<textarea
						disabled={nameD()}
						ref={nameInputRef!}
						placeholder="你的昵称"
						autocomplete="off"
						autofocus
						rows="1"
						gen-textarea
					/>
				</div>
				<p class="my-2 leading-normal text-sm op-50 dark:op-60">输入你的问题</p>
				<div>
					<textarea
						ref={systemInputRef!}
						placeholder="描述问题"
						autocomplete="off"
						autofocus
						rows="3"
						gen-textarea
					/>
				</div>
				<button
					class="w-full mt-2"
					gen-slate-btn
					onClick={() => {
						if (nameInputRef.value.trim() === '') {
							alert('昵称不能为空')
						} else handleButtonClick()
					}}
				>
					发送
				</button>
			</div>
		</div>
	)
}

export default Bullet
