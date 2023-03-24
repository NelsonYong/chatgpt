import { createSignal, Show } from 'solid-js'
import type { Accessor, Setter } from 'solid-js'
import IconEnv from './icons/Env'
import Modal from './Modal'

interface Props {
	canEdit: Accessor<boolean>
	systemRoleEditing: Accessor<boolean>
	setSystemRoleEditing: Setter<boolean>
	currentSystemRoleSettings: Accessor<string>
	setCurrentSystemRoleSettings: Setter<string>
	handleButtonPresetClick: (v: string) => void
}

export default (props: Props) => {
	let systemInputRef: HTMLTextAreaElement

	const [visiable, setVisiable] = createSignal(false)

	const handleButtonClick = () => {
		props.setCurrentSystemRoleSettings(systemInputRef.value)
		props.setSystemRoleEditing(false)
	}

	const handleButtonPresetClick = (value: any) => {
		systemInputRef.value = value
		props.setCurrentSystemRoleSettings(value)
		props.setSystemRoleEditing(false)
	}

	return (
		<div class="my-4">
			<Show when={visiable()}>
				<Modal
					setVisiable={setVisiable}
					handleButtonPresetClick={handleButtonPresetClick}
					handleButtonPresetInputClick={props.handleButtonPresetClick}
				/>
			</Show>
			<Show when={!props.systemRoleEditing()}>
				<Show when={props.currentSystemRoleSettings()}>
					<div>
						<div class="fi gap-1 op-50 dark:op-60">
							<IconEnv />
							<span>预设角色:</span>
						</div>
						<div class="mt-1">{props.currentSystemRoleSettings()}</div>
					</div>
				</Show>
				<Show when={!props.currentSystemRoleSettings() && props.canEdit()}>
					<span
						onClick={() =>
							props.setSystemRoleEditing(!props.systemRoleEditing())
						}
						class="sys-edit-btn"
					>
						<IconEnv />
						<span>添加角色</span>
					</span>
				</Show>
			</Show>
			<Show when={props.systemRoleEditing() && props.canEdit()}>
				<div>
					<div class="fi gap-1 op-50 dark:op-60">
						<IconEnv />
						<span>预设角色:</span>
					</div>
					<p class="my-2 leading-normal text-sm op-50 dark:op-60">
						设定助手的行为
					</p>
					<span
						onClick={() => {
							setVisiable(true)
						}}
						class="sys-edit-btn mb-4"
					>
						<span>预设行为列表</span>
					</span>
					<div>
						<textarea
							ref={systemInputRef!}
							placeholder="请尽可能简洁地回答"
							autocomplete="off"
							autofocus
							rows="3"
							gen-textarea
						/>
					</div>
					<button onClick={handleButtonClick} gen-slate-btn>
						设置
					</button>
				</div>
			</Show>
		</div>
	)
}
