import { createEffect, createMemo, createSignal, For } from 'solid-js'
import useRequest from 'solid-request'
import './Modal.css'

interface Props {
	setVisiable: (v: boolean) => void
	handleButtonPresetClick: (value: any) => void
	handleButtonPresetInputClick: (value: any) => void
}
const Modal = (props: Props) => {
	// let inputRef: HTMLTextAreaElement
	const [input, setInput] = createSignal<string>('')
	const [data, setData] = createSignal([])
	useRequest(() => fetch('/prompt.json').then((res) => res.json()), {
		onSuccess: (res) => {
			setData(() => res)
		},
	})

	// onMount(() => {
	// 	inputRef.addEventListener('input', function () {
	// 		// 处理输入事件
	// 		// console.log('输入的内容：', inputRef.value)
	// 		const res = data().filter((item) =>
	// 			new RegExp(item.act, 'g').test(inputRef.value)
	// 		)
	// 		setData(res)
	// 	})
	// })

	const list = createMemo(() =>
		data()?.filter((item) => new RegExp(input(), 'g').test(item.act))
	)

	return (
		<div class="bg">
			<div id="ofBar">
				<div id="ofBar-title">预设行为列表</div>
				<div id="ofBar-content">
					<div class="gen-text-wrapper">
						<input
							gen-textarea
							onInput={(e: any) => {
								setInput(e.target.value)
							}}
						/>
					</div>
					<For each={list()} fallback={<div>无内容</div>}>
						{(item) => (
							<div
								class="item"
								onClick={() => {
									props.setVisiable(false)
									props.handleButtonPresetClick(item.act)
									props.handleButtonPresetInputClick(item.prompt)
								}}
							>
								{item.act}
							</div>
						)}
					</For>
				</div>
				<div
					id="ofBar-right"
					onClick={() => {
						props.setVisiable(false)
					}}
				>
					<div>
						<a id="btn-bar">关闭</a>
						<a id="close-bar">×</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Modal
