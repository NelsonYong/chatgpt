import { createMemo, createSignal, For } from 'solid-js'
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
	const { data: data1 } = useRequest(
		() => fetch('/prompt.json').then((res) => res.json()),
		{
			onSuccess: (res) => {
				setData(() => res)
			},
		}
	)

	const list = createMemo(() =>
		data()?.filter((item) => new RegExp(input(), 'g').test(item.act))
	)

	return (
		<div
			class="bg"
			// onClick={() => {
			// 	props.setVisiable(false)
			// }}
		>
			{JSON.stringify(data1())}
			<div id="ofBar">
				<div id="ofBar-title">
					<div class="header">
						<span class="title">预设行为列表</span>
						<span
							class="close"
							onClick={() => {
								props.setVisiable(false)
							}}
						>
							<a>×</a>
						</span>
					</div>

					{/* 
					<div id="ofBar-right">
						<div>
							<a id="btn-bar">关闭</a>
						</div>
					</div> */}
					<div class="gen-text-wrapper text-sm">
						<input
							gen-textarea
							onInput={(e: any) => {
								setInput(e.target.value)
							}}
						/>
					</div>
				</div>
				<div id="ofBar-content">
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
			</div>
		</div>
	)
}

export default Modal
