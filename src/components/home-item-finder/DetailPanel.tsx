import { useRef, useState } from 'react';
import { useHomeStore } from '#/store/useHomeStore';
import {
	AddDrawerBtn,
	AddItemBtn,
	AddItemInput,
	AddItemRow,
	DragHandle,
	DrawerCardWrapper,
	DrawerDeleteBtn,
	DrawerHeader,
	DrawerLabelInput,
	DrawerList,
	ItemCount,
	ItemDoneBtn,
	ItemEditBtn,
	ItemEditForm,
	ItemInput,
	ItemMemo,
	ItemMemoInput,
	ItemName,
	ItemRow,
	ItemRowDeleteBtn,
	ItemTagInput,
	ItemWrapper,
	ItemsContainer,
	PanelCloseBtn,
	PanelContainer,
	PanelDeleteBtn,
	PanelHeader,
	PanelLabelInput,
	SectionLabel,
	Tag,
	TagList,
	ToggleBtn,
} from './DetailPanel.styles';
import type { Drawer } from './types';

export default function DetailPanel() {
	const {
		furniture,
		detailFurnitureId,
		openDetail,
		updateFurniture,
		deleteFurniture,
		addDrawer,
		updateDrawer,
		deleteDrawer,
		reorderDrawers,
		addItem,
		updateItem,
		deleteItem,
	} = useHomeStore();

	const f = furniture.find((fu) => fu.id === detailFurnitureId);
	const [expandedDrawerId, setExpandedDrawerId] = useState<string | null>(null);
	const [newItemInputs, setNewItemInputs] = useState<Record<string, string>>(
		{},
	);
	const [editingItem, setEditingItem] = useState<string | null>(null);
	const [draggingDrawer, setDraggingDrawer] = useState<string | null>(null);
	const dragOverRef = useRef<string | null>(null);

	if (!f) return null;

	const handleLabelChange = (val: string) => {
		updateFurniture(f.id, { label: val });
	};

	const handleDrawerLabelChange = (drawerId: string, val: string) => {
		updateDrawer(f.id, drawerId, val);
	};

	const handleAddItem = (drawerId: string) => {
		const name = newItemInputs[drawerId]?.trim();
		if (!name) return;
		addItem(f.id, drawerId, name);
		setNewItemInputs((prev) => ({ ...prev, [drawerId]: '' }));
	};

	const handleDragStart = (drawerId: string) => setDraggingDrawer(drawerId);

	const handleDragOver = (drawerId: string) => {
		dragOverRef.current = drawerId;
	};

	const handleDrop = () => {
		if (
			!draggingDrawer ||
			!dragOverRef.current ||
			draggingDrawer === dragOverRef.current
		) {
			setDraggingDrawer(null);
			return;
		}
		const drawers = [...f.drawers];
		const fromIdx = drawers.findIndex((d) => d.id === draggingDrawer);
		const toIdx = drawers.findIndex((d) => d.id === dragOverRef.current);
		if (fromIdx === -1 || toIdx === -1) return;
		const [moved] = drawers.splice(fromIdx, 1);
		drawers.splice(toIdx, 0, moved);
		reorderDrawers(
			f.id,
			drawers.map((d, i) => ({ ...d, order: i })),
		);
		setDraggingDrawer(null);
		dragOverRef.current = null;
	};

	const sortedDrawers = [...f.drawers].sort((a, b) => a.order - b.order);

	return (
		<PanelContainer>
			{/* Header */}
			<PanelHeader>
				<PanelLabelInput
					value={f.label}
					onChange={(e) => handleLabelChange(e.target.value)}
				/>
				<PanelDeleteBtn
					type="button"
					onClick={() => {
						if (window.confirm(`"${f.label}"을(를) 삭제할까요?\n안에 있는 서랍과 아이템도 모두 삭제됩니다.`))
							deleteFurniture(f.id);
					}}
				>
					🗑️ 삭제
				</PanelDeleteBtn>
				<PanelCloseBtn
					type="button"
					onClick={() => openDetail(null)}
				>
					✕
				</PanelCloseBtn>
			</PanelHeader>

			{/* Drawer List */}
			<DrawerList>
				<SectionLabel>서랍 목록</SectionLabel>

				{sortedDrawers.map((drawer) => (
					<DrawerCard
						key={drawer.id}
						drawer={drawer}
						furnitureId={f.id}
						expanded={expandedDrawerId === drawer.id}
						onToggle={() =>
							setExpandedDrawerId((id) => (id === drawer.id ? null : drawer.id))
						}
						onLabelChange={(val) => handleDrawerLabelChange(drawer.id, val)}
						onDelete={() => deleteDrawer(f.id, drawer.id)}
						newItemInput={newItemInputs[drawer.id] ?? ''}
						onNewItemChange={(val) =>
							setNewItemInputs((prev) => ({ ...prev, [drawer.id]: val }))
						}
						onAddItem={() => handleAddItem(drawer.id)}
						editingItem={editingItem}
						setEditingItem={setEditingItem}
						onUpdateItem={(itemId, updates) =>
							updateItem(f.id, drawer.id, itemId, updates)
						}
						onDeleteItem={(itemId) => deleteItem(f.id, drawer.id, itemId)}
						dragging={draggingDrawer === drawer.id}
						onDragStart={() => handleDragStart(drawer.id)}
						onDragOver={() => handleDragOver(drawer.id)}
						onDrop={handleDrop}
					/>
				))}

				<AddDrawerBtn
					type="button"
					onClick={() => addDrawer(f.id)}
				>
					+ 서랍 추가
				</AddDrawerBtn>
			</DrawerList>
		</PanelContainer>
	);
}

interface DrawerCardProps {
	drawer: Drawer;
	furnitureId: string;
	expanded: boolean;
	onToggle: () => void;
	onLabelChange: (val: string) => void;
	onDelete: () => void;
	newItemInput: string;
	onNewItemChange: (val: string) => void;
	onAddItem: () => void;
	editingItem: string | null;
	setEditingItem: (id: string | null) => void;
	onUpdateItem: (
		itemId: string,
		updates: { name?: string; memo?: string; tags?: string[] },
	) => void;
	onDeleteItem: (itemId: string) => void;
	dragging: boolean;
	onDragStart: () => void;
	onDragOver: () => void;
	onDrop: () => void;
}

function DrawerCard({
	drawer,
	expanded,
	onToggle,
	onLabelChange,
	onDelete,
	newItemInput,
	onNewItemChange,
	onAddItem,
	editingItem,
	setEditingItem,
	onUpdateItem,
	onDeleteItem,
	dragging,
	onDragStart,
	onDragOver,
	onDrop,
}: DrawerCardProps) {
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop reorder UI
		<DrawerCardWrapper
			$dragging={dragging}
			draggable
			onDragStart={onDragStart}
			onDragOver={(e) => {
				e.preventDefault();
				onDragOver();
			}}
			onDrop={onDrop}
		>
			{/* Drawer Header */}
			<DrawerHeader>
				<DragHandle>⠿</DragHandle>
				<DrawerLabelInput
					value={drawer.label}
					onChange={(e) => onLabelChange(e.target.value)}
					onClick={(e) => e.stopPropagation()}
				/>
				<ItemCount>{drawer.items.length}개</ItemCount>
				<ToggleBtn type="button" onClick={onToggle}>
					{expanded ? '▲' : '▼'}
				</ToggleBtn>
				<DrawerDeleteBtn type="button" onClick={onDelete}>
					✕
				</DrawerDeleteBtn>
			</DrawerHeader>

			{/* Items */}
			{expanded && (
				<ItemsContainer>
					{drawer.items.map((item) => (
						<ItemWrapper key={item.id}>
							{editingItem === item.id ? (
								<ItemEditForm>
									<ItemInput
										value={item.name}
										onChange={(e) =>
											onUpdateItem(item.id, { name: e.target.value })
										}
										placeholder="이름"
									/>
									<ItemMemoInput
										value={item.memo}
										onChange={(e) =>
											onUpdateItem(item.id, { memo: e.target.value })
										}
										placeholder="메모"
									/>
									<ItemTagInput
										value={item.tags.join(', ')}
										onChange={(e) =>
											onUpdateItem(item.id, {
												tags: e.target.value
													.split(',')
													.map((t) => t.trim())
													.filter(Boolean),
											})
										}
										placeholder="태그 (쉼표로 구분)"
									/>
									<ItemDoneBtn
										type="button"
										onClick={() => setEditingItem(null)}
									>
										완료
									</ItemDoneBtn>
								</ItemEditForm>
							) : (
								<ItemRow>
									<ItemEditBtn
										type="button"
										onClick={() => setEditingItem(item.id)}
									>
										<ItemName>{item.name}</ItemName>
										{item.memo && <ItemMemo>{item.memo}</ItemMemo>}
										{item.tags.length > 0 && (
											<TagList>
												{item.tags.map((tag) => (
													<Tag key={tag}>{tag}</Tag>
												))}
											</TagList>
										)}
									</ItemEditBtn>
									<ItemRowDeleteBtn
										type="button"
										onClick={() => onDeleteItem(item.id)}
									>
										✕
									</ItemRowDeleteBtn>
								</ItemRow>
							)}
						</ItemWrapper>
					))}

					{/* Add Item */}
					<AddItemRow>
						<AddItemInput
							value={newItemInput}
							onChange={(e) => onNewItemChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.nativeEvent.isComposing) onAddItem();
							}}
							placeholder="아이템 이름 입력"
						/>
						<AddItemBtn type="button" onClick={onAddItem}>
							추가
						</AddItemBtn>
					</AddItemRow>
				</ItemsContainer>
			)}
		</DrawerCardWrapper>
	);
}
