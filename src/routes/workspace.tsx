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
	const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { detailFurnitureId, exportData, importData, clearData } =
		useHomeStore();

	const showToast = (msg: string) => {
		setToast(msg);
		if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
		toastTimerRef.current = setTimeout(() => setToast(null), 2500);
	};

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
					<HeaderBtn onClick={exportData}>내보내기</HeaderBtn>
					<HeaderBtn onClick={handleImport}>가져오기</HeaderBtn>
					<HeaderBtn onClick={handleClear} danger>
						초기화
					</HeaderBtn>
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
		</PageWrapper>
	);
}

function HeaderBtn({
	children,
	onClick,
	danger,
}: {
	children: React.ReactNode;
	onClick: () => void;
	danger?: boolean;
}) {
	return (
		<StyledHeaderBtn type="button" onClick={onClick} $danger={danger}>
			{children}
		</StyledHeaderBtn>
	);
}
