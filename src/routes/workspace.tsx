import { createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import DetailPanel from '#/components/home-item-finder/DetailPanel';
import SearchBar from '#/components/home-item-finder/SearchBar';
import Sidebar from '#/components/home-item-finder/Sidebar';
import { useHomeStore } from '#/store/useHomeStore';
import {
	CanvasArea,
	CanvasLoadingFallback,
	Header,
	HeaderActions,
	HelpBtn,
	HelpModal,
	HelpModalClose,
	HelpModalHeader,
	HelpModalTitle,
	HelpOverlay,
	HelpStep,
	HelpStepBody,
	HelpStepDesc,
	HelpStepIcon,
	HelpStepTitle,
	PageWrapper,
	StyledHeaderBtn,
	Toast,
	WorkspaceBody,
} from './workspace.styles';

const Canvas = lazy(() => import('#/components/home-item-finder/Canvas'));

export const Route = createFileRoute('/workspace')({
	component: RouteComponent,
});

function RouteComponent() {
	const canvasWrapRef = useRef<HTMLDivElement>(null);
	const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
	const [toast, setToast] = useState<string | null>(null);
	const [showHelp, setShowHelp] = useState(false);
	const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { detailFurnitureId, exportData, importData, clearData, _past, _future } =
		useHomeStore();

	const showToast = (msg: string) => {
		setToast(msg);
		if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		toastTimerRef.current = setTimeout(() => setToast(null), 2500);
	};

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (!(e.ctrlKey || e.metaKey)) return;
			const { undo, redo } = useHomeStore.getState();
			if (e.key === 'z') {
				e.preventDefault();
				e.shiftKey ? redo() : undo();
			} else if (e.key === 'y') {
				e.preventDefault();
				redo();
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, []);

	useEffect(() => {
		const updateSize = () => {
			if (!canvasWrapRef.current) return;
			const { width, height } = canvasWrapRef.current.getBoundingClientRect();
			setCanvasSize({ width, height });
		};
		updateSize();
		const ro = new ResizeObserver(updateSize);
		if (canvasWrapRef.current) ro.observe(canvasWrapRef.current);
		return () => ro.disconnect();
	}, []);

	const handleAddRoom = () => {
		window.dispatchEvent(new CustomEvent('canvas:startDrawing'));
	};

	const handleImport = () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (ev) => {
				try {
					const data = JSON.parse(ev.target?.result as string);
					importData(data);
					showToast('데이터를 가져왔습니다');
				} catch {
					showToast('파일을 읽을 수 없습니다');
				}
			};
			reader.readAsText(file);
		};
		input.click();
	};

	const handleClear = () => {
		if (window.confirm('모든 데이터를 초기화하시겠습니까?')) {
			clearData();
		}
	};

	return (
		<PageWrapper>
			{/* Header */}
			<Header>
				<SearchBar />
				<HeaderActions>
					<HeaderBtn
						onClick={() => useHomeStore.getState().undo()}
						disabled={_past.length === 0}
						title="실행 취소 (Ctrl+Z)"
					>
						↩ 실행취소
					</HeaderBtn>
					<HeaderBtn
						onClick={() => useHomeStore.getState().redo()}
						disabled={_future.length === 0}
						title="다시 실행 (Ctrl+Shift+Z)"
					>
						↪ 다시실행
					</HeaderBtn>
					<HeaderBtn onClick={exportData}>내보내기</HeaderBtn>
					<HeaderBtn onClick={handleImport}>가져오기</HeaderBtn>
					<HeaderBtn onClick={handleClear} danger>
						초기화
					</HeaderBtn>
					<HelpBtn type="button" onClick={() => setShowHelp(true)} title="사용 방법">
						?
					</HelpBtn>
				</HeaderActions>
			</Header>

			{/* Body */}
			<WorkspaceBody>
				<Sidebar onAddRoom={handleAddRoom} toast={showToast} />

				{/* Canvas Area */}
				<CanvasArea ref={canvasWrapRef}>
					<Suspense fallback={<CanvasLoadingFallback>불러오는 중...</CanvasLoadingFallback>}>
						<Canvas width={canvasSize.width} height={canvasSize.height} />
					</Suspense>
				</CanvasArea>

				{detailFurnitureId && <DetailPanel />}
			</WorkspaceBody>

			{/* Toast */}
			{toast && <Toast>{toast}</Toast>}

			{/* Help Modal */}
			{showHelp && (
				// biome-ignore lint/a11y/noStaticElementInteractions: overlay click to dismiss
				// biome-ignore lint/a11y/useKeyWithClickEvents: overlay dismiss does not need keyboard equivalent
				<HelpOverlay onClick={() => setShowHelp(false)}>
					{/* biome-ignore lint/a11y/noStaticElementInteractions: prevent overlay close on modal click */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: modal content does not need keyboard close */}
					<HelpModal onClick={(e) => e.stopPropagation()}>
						<HelpModalHeader>
							<HelpModalTitle>🏠 사용 방법</HelpModalTitle>
							<HelpModalClose type="button" onClick={() => setShowHelp(false)}>
								✕
							</HelpModalClose>
						</HelpModalHeader>

						<HelpStep>
							<HelpStepIcon>✏️</HelpStepIcon>
							<HelpStepBody>
								<HelpStepTitle>방 그리기</HelpStepTitle>
								<HelpStepDesc>
									사이드바의 "+ 방 추가" 버튼을 누른 뒤, 캔버스 위에서 드래그해 방 크기를 정하세요.
									방 이름은 사이드바에서 클릭해 바로 수정할 수 있어요.
								</HelpStepDesc>
							</HelpStepBody>
						</HelpStep>

						<HelpStep>
							<HelpStepIcon>🗄️</HelpStepIcon>
							<HelpStepBody>
								<HelpStepTitle>가구 배치</HelpStepTitle>
								<HelpStepDesc>
									방을 선택한 뒤 사이드바의 가구 버튼을 눌러 추가하세요.
									가구는 드래그로 이동하고, 핸들을 잡아 크기와 회전도 바꿀 수 있어요.
									방 경계 밖으로는 벗어나지 않고, 방을 옮기면 가구도 함께 이동해요.
								</HelpStepDesc>
							</HelpStepBody>
						</HelpStep>

						<HelpStep>
							<HelpStepIcon>📦</HelpStepIcon>
							<HelpStepBody>
								<HelpStepTitle>물건 등록</HelpStepTitle>
								<HelpStepDesc>
									가구를 클릭하면 오른쪽에 상세 패널이 열려요.
									서랍을 추가하고, 서랍마다 물건 이름·메모·태그를 기록하세요.
									서랍은 드래그로 순서를 바꿀 수 있어요.
								</HelpStepDesc>
							</HelpStepBody>
						</HelpStep>

						<HelpStep>
							<HelpStepIcon>🔍</HelpStepIcon>
							<HelpStepBody>
								<HelpStepTitle>물건 찾기</HelpStepTitle>
								<HelpStepDesc>
									상단 검색창에 물건 이름, 메모, 태그를 입력하면
									몇 번 방 → 어떤 가구 → 어떤 서랍에 있는지 바로 알려줘요.
								</HelpStepDesc>
							</HelpStepBody>
						</HelpStep>

						<HelpStep>
							<HelpStepIcon>🗑️</HelpStepIcon>
							<HelpStepBody>
								<HelpStepTitle>삭제</HelpStepTitle>
								<HelpStepDesc>
									방과 가구는 우클릭 컨텍스트 메뉴로 삭제할 수 있어요.
									방은 사이드바 하단, 가구는 상세 패널 상단의 삭제 버튼으로도 지울 수 있어요.
								</HelpStepDesc>
							</HelpStepBody>
						</HelpStep>

						<HelpStep>
							<HelpStepIcon>💾</HelpStepIcon>
							<HelpStepBody>
								<HelpStepTitle>데이터 백업</HelpStepTitle>
								<HelpStepDesc>
									데이터는 브라우저에 자동 저장돼요.
									"내보내기"로 JSON 파일을 저장하고, "가져오기"로 다시 불러올 수 있어요.
								</HelpStepDesc>
							</HelpStepBody>
						</HelpStep>
					</HelpModal>
				</HelpOverlay>
			)}
		</PageWrapper>
	);
}

function HeaderBtn({
	children,
	onClick,
	danger,
	disabled,
	title,
}: {
	children: React.ReactNode;
	onClick: () => void;
	danger?: boolean;
	disabled?: boolean;
	title?: string;
}) {
	return (
		<StyledHeaderBtn type="button" onClick={onClick} $danger={danger} disabled={disabled} title={title}>
			{children}
		</StyledHeaderBtn>
	);
}
