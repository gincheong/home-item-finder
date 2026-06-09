import { useRef, useState } from 'react';
import { useHomeStore } from '#/store/useHomeStore';
import {
	ClearBtn,
	Dropdown,
	EmptyResult,
	EmptyResultIcon,
	EmptyResultText,
	HighlightMark,
	ResultItem,
	ResultMemo,
	ResultName,
	ResultPath,
	ResultTags,
	SearchContainer,
	SearchIcon,
	SearchInput,
	SearchInputWrapper,
	Tag,
} from './SearchBar.styles';

export default function SearchBar() {
	const {
		searchQuery,
		setSearchQuery,
		getSearchResults,
		selectRoom,
		selectFurniture,
		openDetail,
	} = useHomeStore();
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const results = open && searchQuery ? getSearchResults() : [];

	const handleSelect = (furnitureId: string, roomId: string) => {
		selectRoom(roomId);
		selectFurniture(furnitureId);
		openDetail(furnitureId);
		setOpen(false);
		setSearchQuery('');
	};

	return (
		<SearchContainer>
			<SearchInputWrapper $open={open}>
				<SearchIcon>🔍</SearchIcon>
				<SearchInput
					ref={inputRef}
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					onBlur={() => setTimeout(() => setOpen(false), 150)}
					placeholder="아이템 검색 (이름, 메모, 태그)"
				/>
				{searchQuery && (
					<ClearBtn
						type="button"
						onClick={() => {
							setSearchQuery('');
							setOpen(false);
						}}
					>
						✕
					</ClearBtn>
				)}
			</SearchInputWrapper>

			{open && searchQuery && (
				<Dropdown>
					{results.length === 0 ? (
						<EmptyResult>
							<EmptyResultIcon>🤷</EmptyResultIcon>
							<EmptyResultText>찾을 수 없어요</EmptyResultText>
						</EmptyResult>
					) : (
						results.map((r) => (
							<ResultItem
								key={r.item.id}
								type="button"
								onMouseDown={() => handleSelect(r.furniture.id, r.room.id)}
							>
								<ResultName>{highlight(r.item.name, searchQuery)}</ResultName>
								<ResultPath>
									{r.room.name} → {r.furniture.label} → {r.drawer.label}
								</ResultPath>
								{r.item.memo && (
									<ResultMemo>{highlight(r.item.memo, searchQuery)}</ResultMemo>
								)}
								{r.item.tags.length > 0 && (
									<ResultTags>
										{r.item.tags.map((tag) => (
											<Tag key={tag}>{tag}</Tag>
										))}
									</ResultTags>
								)}
							</ResultItem>
						))
					)}
				</Dropdown>
			)}
		</SearchContainer>
	);
}

function highlight(text: string, query: string): React.ReactNode {
	const idx = text.toLowerCase().indexOf(query.toLowerCase());
	if (idx === -1) return text;
	return (
		<>
			{text.slice(0, idx)}
			<HighlightMark>{text.slice(idx, idx + query.length)}</HighlightMark>
			{text.slice(idx + query.length)}
		</>
	);
}
