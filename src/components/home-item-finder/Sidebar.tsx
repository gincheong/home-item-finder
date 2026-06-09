import { useRef, useState } from 'react';
import { useHomeStore } from '#/store/useHomeStore';
import {
	AddRoomBtn,
	DeleteRoomBtn,
	EmptyRooms,
	FurnitureBtn,
	FurnitureBtnIcon,
	FurnitureBtnLabel,
	FurnitureGrid,
	RoomBtn,
	RoomDot,
	RoomNameBtn,
	RoomNameInput,
	SectionContent,
	SectionLabel,
	SectionWrapper,
	SelectedInfo,
	SelectedInfoName,
	SidebarBody,
	SidebarContainer,
	SidebarHeader,
	SidebarSubtitle,
	SidebarTitle,
} from './Sidebar.styles';
import type { FurnitureType } from './types';

const FURNITURE_BUTTONS: {
	type: FurnitureType;
	icon: string;
	label: string;
}[] = [
	{ type: 'dresser', icon: '🗄️', label: '서랍장' },
	{ type: 'wardrobe', icon: '🚪', label: '옷장' },
	{ type: 'shelf', icon: '📚', label: '선반' },
	{ type: 'custom', icon: '📦', label: '커스텀' },
];

interface SidebarProps {
	onAddRoom: () => void;
	toast: (msg: string) => void;
}

export default function Sidebar({ onAddRoom, toast }: SidebarProps) {
	const {
		rooms,
		furniture,
		selectedRoomId,
		selectedFurnitureId,
		selectRoom,
		addFurniture,
		updateRoom,
		deleteRoom,
	} = useHomeStore();

	const [editingRoomName, setEditingRoomName] = useState(false);
	const prevRoomId = useRef(selectedRoomId);
	if (prevRoomId.current !== selectedRoomId) {
		prevRoomId.current = selectedRoomId;
		if (editingRoomName) setEditingRoomName(false);
	}

	const handleAddFurniture = (type: FurnitureType) => {
		if (!selectedRoomId) {
			toast('방을 먼저 선택하세요');
			return;
		}
		addFurniture(type);
	};

	const selectedFurniture = furniture.find((f) => f.id === selectedFurnitureId);
	const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

	return (
		<SidebarContainer>
			{/* Header */}
			<SidebarHeader>
				<SidebarTitle>🏠 집안 물건 찾기</SidebarTitle>
				<SidebarSubtitle>물건 위치를 쉽게 관리하세요</SidebarSubtitle>
			</SidebarHeader>

			<SidebarBody>
				{/* Room Section */}
				<Section label="방 목록">
					<AddRoomBtn type="button" onClick={onAddRoom}>
						+ 방 추가
					</AddRoomBtn>
					{rooms.length === 0 && <EmptyRooms>방이 없습니다</EmptyRooms>}
					{rooms.map((room) => (
						<RoomBtn
							key={room.id}
							type="button"
							onClick={() => selectRoom(room.id)}
							$selected={room.id === selectedRoomId}
						>
							<RoomDot $color={room.color.replace('0.35', '0.8')} />
							{room.name}
						</RoomBtn>
					))}
				</Section>

				{/* Furniture Section */}
				<Section label="가구 추가">
					<FurnitureGrid>
						{FURNITURE_BUTTONS.map((btn) => (
							<FurnitureBtn
								key={btn.type}
								type="button"
								onClick={() => handleAddFurniture(btn.type)}
							>
								<FurnitureBtnIcon>{btn.icon}</FurnitureBtnIcon>
								<FurnitureBtnLabel>{btn.label}</FurnitureBtnLabel>
							</FurnitureBtn>
						))}
					</FurnitureGrid>
				</Section>

				{/* Selected Info */}
				{(selectedFurniture || selectedRoom) && (
					<Section label="선택 정보">
						{selectedFurniture ? (
							<SelectedInfo>
								<SelectedInfoName>{selectedFurniture.label}</SelectedInfoName>
								<div>
									위치: ({Math.round(selectedFurniture.x)},{' '}
									{Math.round(selectedFurniture.y)})
								</div>
								<div>
									크기: {Math.round(selectedFurniture.width)} ×{' '}
									{Math.round(selectedFurniture.height)}
								</div>
								<div>회전: {Math.round(selectedFurniture.rotation)}°</div>
								<div style={{ marginTop: 4 }}>
									서랍 {selectedFurniture.drawers.length}개
								</div>
								<div>
									아이템{' '}
									{selectedFurniture.drawers.reduce(
										(s, d) => s + d.items.length,
										0,
									)}
									개
								</div>
							</SelectedInfo>
						) : selectedRoom ? (
							<SelectedInfo>
								{editingRoomName ? (
									<RoomNameInput
										// biome-ignore lint/a11y/noAutofocus: 이름 편집 시 즉시 포커스
										autoFocus
										defaultValue={selectedRoom.name}
										onBlur={(e) => {
											const val = e.target.value.trim();
											if (val) updateRoom(selectedRoom.id, { name: val });
											setEditingRoomName(false);
										}}
										onKeyDown={(e) => {
											if (e.key === 'Enter' && !e.nativeEvent.isComposing) e.currentTarget.blur();
											if (e.key === 'Escape') {
												setEditingRoomName(false);
											}
										}}
									/>
								) : (
									<RoomNameBtn
										type="button"
										onClick={() => setEditingRoomName(true)}
										title="클릭해서 이름 편집"
									>
										{selectedRoom.name} ✏️
									</RoomNameBtn>
								)}
								<div>
									크기: {Math.round(selectedRoom.width)} ×{' '}
									{Math.round(selectedRoom.height)}
								</div>
								<div>
									가구{' '}
									{furniture.filter((f) => f.roomId === selectedRoom.id).length}
									개
								</div>
								<DeleteRoomBtn
									type="button"
									onClick={() => {
										if (window.confirm(`"${selectedRoom.name}"을(를) 삭제할까요?\n방 안의 가구와 아이템도 모두 삭제됩니다.`))
											deleteRoom(selectedRoom.id);
									}}
								>
									🗑️ 방 삭제
								</DeleteRoomBtn>
							</SelectedInfo>
						) : null}
					</Section>
				)}
			</SidebarBody>
		</SidebarContainer>
	);
}

function Section({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<SectionWrapper>
			<SectionLabel>{label}</SectionLabel>
			<SectionContent>{children}</SectionContent>
		</SectionWrapper>
	);
}
