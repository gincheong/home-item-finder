import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
	Drawer,
	Furniture,
	FurnitureType,
	Item,
	Room,
} from '#/components/home-item-finder/types';

const ROOM_COLORS = [
	'rgba(30, 58, 95, 0.35)',
	'rgba(45, 30, 95, 0.35)',
	'rgba(30, 95, 58, 0.35)',
	'rgba(95, 58, 30, 0.35)',
	'rgba(58, 95, 30, 0.35)',
	'rgba(95, 30, 58, 0.35)',
];

const FURNITURE_DEFAULTS: Record<
	FurnitureType,
	{ label: string; width: number; height: number }
> = {
	dresser: { label: '서랍장', width: 100, height: 60 },
	wardrobe: { label: '옷장', width: 120, height: 70 },
	shelf: { label: '선반', width: 130, height: 40 },
	custom: { label: '가구', width: 100, height: 80 },
};

const uid = () => Math.random().toString(36).slice(2, 10);

type Snapshot = { rooms: Room[]; furniture: Furniture[] };

interface SearchResult {
	item: Item;
	drawer: Drawer;
	furniture: Furniture;
	room: Room;
}

interface HomeStore {
	rooms: Room[];
	furniture: Furniture[];
	selectedRoomId: string | null;
	selectedFurnitureId: string | null;
	detailFurnitureId: string | null;
	searchQuery: string;
	_past: Snapshot[];
	_future: Snapshot[];

	addRoom: (x: number, y: number, width: number, height: number) => void;
	updateRoom: (
		id: string,
		updates: Partial<Omit<Room, 'id' | 'color'>>,
	) => void;
	moveRoomWithFurniture: (id: string, x: number, y: number) => void;
	deleteRoom: (id: string) => void;
	selectRoom: (id: string | null) => void;

	addFurniture: (type: FurnitureType) => void;
	updateFurniture: (
		id: string,
		updates: Partial<Omit<Furniture, 'drawers'>>,
	) => void;
	deleteFurniture: (id: string) => void;
	selectFurniture: (id: string | null) => void;
	openDetail: (id: string | null) => void;

	addDrawer: (furnitureId: string) => void;
	updateDrawer: (furnitureId: string, drawerId: string, label: string) => void;
	deleteDrawer: (furnitureId: string, drawerId: string) => void;
	reorderDrawers: (furnitureId: string, drawers: Drawer[]) => void;

	addItem: (furnitureId: string, drawerId: string, name: string) => void;
	updateItem: (
		furnitureId: string,
		drawerId: string,
		itemId: string,
		updates: Partial<Item>,
	) => void;
	deleteItem: (furnitureId: string, drawerId: string, itemId: string) => void;
	moveItem: (
		fromFurnitureId: string,
		fromDrawerId: string,
		itemId: string,
		toFurnitureId: string,
		toDrawerId: string,
	) => void;

	setSearchQuery: (q: string) => void;
	getSearchResults: () => SearchResult[];

	undo: () => void;
	redo: () => void;

	exportData: () => void;
	importData: (data: unknown) => void;
	clearData: () => void;
}

export const useHomeStore = create<HomeStore>()(
	persist(
		(set, get) => {
			const saveSnapshot = () => {
				const { rooms, furniture, _past } = get();
				set({
					_past: [..._past.slice(-49), { rooms, furniture }],
					_future: [],
				});
			};

			return {
				rooms: [],
				furniture: [],
				selectedRoomId: null,
				selectedFurnitureId: null,
				detailFurnitureId: null,
				searchQuery: '',
				_past: [],
				_future: [],

				addRoom: (x, y, width, height) => {
					saveSnapshot();
					const { rooms } = get();
					const id = uid();
					const color = ROOM_COLORS[rooms.length % ROOM_COLORS.length];
					set((s) => ({
						rooms: [
							...s.rooms,
							{
								id,
								name: `방 ${s.rooms.length + 1}`,
								x,
								y,
								width,
								height,
								color,
							},
						],
						selectedRoomId: id,
					}));
				},

				updateRoom: (id, updates) => {
					saveSnapshot();
					set((s) => ({
						rooms: s.rooms.map((r) => (r.id === id ? { ...r, ...updates } : r)),
					}));
				},

				moveRoomWithFurniture: (id, x, y) => {
					saveSnapshot();
					set((s) => {
						const room = s.rooms.find((r) => r.id === id);
						if (!room) return s;
						const dx = x - room.x;
						const dy = y - room.y;
						return {
							rooms: s.rooms.map((r) => (r.id === id ? { ...r, x, y } : r)),
							furniture: s.furniture.map((f) =>
								f.roomId === id ? { ...f, x: f.x + dx, y: f.y + dy } : f,
							),
						};
					});
				},

				deleteRoom: (id) => {
					saveSnapshot();
					set((s) => ({
						rooms: s.rooms.filter((r) => r.id !== id),
						furniture: s.furniture.filter((f) => f.roomId !== id),
						selectedRoomId: s.selectedRoomId === id ? null : s.selectedRoomId,
					}));
				},

				selectRoom: (id) =>
					set({ selectedRoomId: id, selectedFurnitureId: null }),

				addFurniture: (type) => {
					const { selectedRoomId, rooms } = get();
					if (!selectedRoomId) return;

					const room = rooms.find((r) => r.id === selectedRoomId);
					if (!room) return;

					saveSnapshot();
					const defaults = FURNITURE_DEFAULTS[type];
					const id = uid();
					const cx = room.x + room.width / 2;
					const cy = room.y + room.height / 2;

					const newFurniture: Furniture = {
						id,
						roomId: selectedRoomId,
						label: defaults.label,
						type,
						x: cx - defaults.width / 2,
						y: cy - defaults.height / 2,
						width: defaults.width,
						height: defaults.height,
						drawers: [],
					};

					set((s) => ({
						furniture: [...s.furniture, newFurniture],
						selectedFurnitureId: id,
					}));
				},

				updateFurniture: (id, updates) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.map((f) =>
							f.id === id ? { ...f, ...updates } : f,
						),
					}));
				},

				deleteFurniture: (id) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.filter((f) => f.id !== id),
						selectedFurnitureId:
							s.selectedFurnitureId === id ? null : s.selectedFurnitureId,
						detailFurnitureId:
							s.detailFurnitureId === id ? null : s.detailFurnitureId,
					}));
				},

				selectFurniture: (id) => {
					const roomId = id ? get().furniture.find((f) => f.id === id)?.roomId : undefined;
					set({ selectedFurnitureId: id, ...(roomId ? { selectedRoomId: roomId } : {}) });
				},

				openDetail: (id) => set({ detailFurnitureId: id }),

				addDrawer: (furnitureId) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.map((f) => {
							if (f.id !== furnitureId) return f;
							const newDrawer: Drawer = {
								id: uid(),
								furnitureId,
								label: `${f.drawers.length + 1}단 서랍`,
								order: f.drawers.length,
								items: [],
							};
							return { ...f, drawers: [...f.drawers, newDrawer] };
						}),
					}));
				},

				updateDrawer: (furnitureId, drawerId, label) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.map((f) => {
							if (f.id !== furnitureId) return f;
							return {
								...f,
								drawers: f.drawers.map((d) =>
									d.id === drawerId ? { ...d, label } : d,
								),
							};
						}),
					}));
				},

				deleteDrawer: (furnitureId, drawerId) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.map((f) => {
							if (f.id !== furnitureId) return f;
							return {
								...f,
								drawers: f.drawers.filter((d) => d.id !== drawerId),
							};
						}),
					}));
				},

				reorderDrawers: (furnitureId, drawers) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.map((f) =>
							f.id === furnitureId ? { ...f, drawers } : f,
						),
					}));
				},

				addItem: (furnitureId, drawerId, name) => {
					saveSnapshot();
					const newItem: Item = {
						id: uid(),
						drawerId,
						name,
						memo: '',
						tags: [],
					};
					set((s) => ({
						furniture: s.furniture.map((f) => {
							if (f.id !== furnitureId) return f;
							return {
								...f,
								drawers: f.drawers.map((d) => {
									if (d.id !== drawerId) return d;
									return { ...d, items: [...d.items, newItem] };
								}),
							};
						}),
					}));
				},

				updateItem: (furnitureId, drawerId, itemId, updates) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.map((f) => {
							if (f.id !== furnitureId) return f;
							return {
								...f,
								drawers: f.drawers.map((d) => {
									if (d.id !== drawerId) return d;
									return {
										...d,
										items: d.items.map((i) =>
											i.id === itemId ? { ...i, ...updates } : i,
										),
									};
								}),
							};
						}),
					}));
				},

				deleteItem: (furnitureId, drawerId, itemId) => {
					saveSnapshot();
					set((s) => ({
						furniture: s.furniture.map((f) => {
							if (f.id !== furnitureId) return f;
							return {
								...f,
								drawers: f.drawers.map((d) => {
									if (d.id !== drawerId) return d;
									return { ...d, items: d.items.filter((i) => i.id !== itemId) };
								}),
							};
						}),
					}));
				},

				moveItem: (fromFurnitureId, fromDrawerId, itemId, toFurnitureId, toDrawerId) => {
					if (fromFurnitureId === toFurnitureId && fromDrawerId === toDrawerId) return;
					saveSnapshot();
					set((s) => {
						let movedItem: Item | null = null;

						const afterRemove = s.furniture.map((f) => {
							if (f.id !== fromFurnitureId) return f;
							return {
								...f,
								drawers: f.drawers.map((d) => {
									if (d.id !== fromDrawerId) return d;
									const found = d.items.find((i) => i.id === itemId);
									if (found) movedItem = found;
									return { ...d, items: d.items.filter((i) => i.id !== itemId) };
								}),
							};
						});

						if (!movedItem) return { furniture: afterRemove };

						const item = movedItem as Item;
						const afterInsert = afterRemove.map((f) => {
							if (f.id !== toFurnitureId) return f;
							return {
								...f,
								drawers: f.drawers.map((d) => {
									if (d.id !== toDrawerId) return d;
									return {
										...d,
										items: [...d.items, { ...item, drawerId: toDrawerId }],
									};
								}),
							};
						});

						return { furniture: afterInsert };
					});
				},

				setSearchQuery: (q) => set({ searchQuery: q }),

				getSearchResults: () => {
					const { searchQuery, rooms, furniture } = get();
					const q = searchQuery.toLowerCase().trim();
					if (!q) return [];

					const results: SearchResult[] = [];
					for (const f of furniture) {
						const room = rooms.find((r) => r.id === f.roomId);
						if (!room) continue;
						for (const d of f.drawers) {
							for (const item of d.items) {
								const matches =
									item.name.toLowerCase().includes(q) ||
									item.memo.toLowerCase().includes(q) ||
									item.tags.some((t) => t.toLowerCase().includes(q));
								if (matches) {
									results.push({ item, drawer: d, furniture: f, room });
								}
							}
						}
					}
					return results;
				},

				undo: () => {
					const { _past, _future, rooms, furniture } = get();
					if (!_past.length) return;
					const prev = _past[_past.length - 1];
					set({
						_past: _past.slice(0, -1),
						_future: [{ rooms, furniture }, ..._future.slice(0, 49)],
						rooms: prev.rooms,
						furniture: prev.furniture,
					});
				},

				redo: () => {
					const { _past, _future, rooms, furniture } = get();
					if (!_future.length) return;
					const next = _future[0];
					set({
						_past: [..._past.slice(-49), { rooms, furniture }],
						_future: _future.slice(1),
						rooms: next.rooms,
						furniture: next.furniture,
					});
				},

				exportData: () => {
					const { rooms, furniture } = get();
					const data = JSON.stringify({ rooms, furniture }, null, 2);
					const blob = new Blob([data], { type: 'application/json' });
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = 'home-finder-data.json';
					a.click();
					URL.revokeObjectURL(url);
				},

				importData: (data) => {
					try {
						const parsed = data as { rooms: Room[]; furniture: Furniture[] };
						if (parsed.rooms && parsed.furniture) {
							set({ rooms: parsed.rooms, furniture: parsed.furniture });
						}
					} catch {
						// ignore invalid data
					}
				},

				clearData: () =>
					set({
						rooms: [],
						furniture: [],
						selectedRoomId: null,
						selectedFurnitureId: null,
						detailFurnitureId: null,
						_past: [],
						_future: [],
					}),
			};
		},
		{
			name: 'home-finder-data',
			partialize: (state) => ({ rooms: state.rooms, furniture: state.furniture }),
		},
	),
);
