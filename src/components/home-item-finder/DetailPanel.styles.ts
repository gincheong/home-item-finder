import styled from 'styled-components';

export const PanelContainer = styled.div`
  width: 360px;
  flex-shrink: 0;
  background: #0f172a;
  border-left: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PanelLabelInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid #334155;
  color: #f1f5f9;
  font-size: 16px;
  font-weight: 700;
  padding: 4px 0;
  outline: none;
`;

export const PanelDeleteBtn = styled.button`
  background: none;
  border: 1px solid #7f1d1d;
  border-radius: 6px;
  color: #f87171;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 8px;
`;

export const PanelCloseBtn = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
`;

export const DrawerList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

export const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  padding-left: 4px;
`;

export const AddDrawerBtn = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  background: transparent;
  border: 1px dashed #334155;
  border-radius: 8px;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
`;

export const DrawerCardWrapper = styled.div<{ $dragging: boolean }>`
  margin-bottom: 6px;
  background: #1e293b;
  border: 1px solid ${({ $dragging }) => ($dragging ? '#60a5fa' : '#334155')};
  border-radius: 8px;
  opacity: ${({ $dragging }) => ($dragging ? 0.5 : 1)};
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 8px;
`;

export const DragHandle = styled.span`
  color: #475569;
  cursor: grab;
  font-size: 14px;
`;

export const DrawerLabelInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  outline: none;
`;

export const ItemCount = styled.span`
  font-size: 11px;
  color: #64748b;
  margin-right: 4px;
`;

export const ToggleBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 12px;
`;

export const DrawerDeleteBtn = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
`;

export const ItemsContainer = styled.div`
  border-top: 1px solid #334155;
  padding: 8px 12px;
`;

export const ItemWrapper = styled.div`
  margin-bottom: 6px;
`;

export const ItemEditForm = styled.div`
  background: #0f172a;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #334155;
`;

export const ItemInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #334155;
  color: #e2e8f0;
  font-size: 13px;
  padding: 4px 0;
  outline: none;
  box-sizing: border-box;
`;

export const ItemMemoInput = styled(ItemInput)`
  margin-top: 6px;
  color: #94a3b8;
`;

export const ItemTagInput = styled(ItemInput)`
  margin-top: 6px;
  color: #60a5fa;
  font-size: 11px;
`;

export const ItemDoneBtn = styled.button`
  margin-top: 8px;
  padding: 4px 12px;
  background: #1e3a5f;
  border: 1px solid #60a5fa;
  border-radius: 6px;
  color: #60a5fa;
  font-size: 11px;
  cursor: pointer;
`;

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  background: #0f172a;
`;

export const ItemEditBtn = styled.button`
  flex: 1;
  background: none;
  border: none;
  text-align: left;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 6px;
`;

export const ItemName = styled.div`
  font-size: 13px;
  color: #e2e8f0;
`;

export const ItemMemo = styled.div`
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
`;

export const TagList = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  font-size: 10px;
  padding: 1px 6px;
  background: #1e3a5f;
  color: #60a5fa;
  border-radius: 4px;
`;

export const ItemRowDeleteBtn = styled.button`
  background: none;
  border: none;
  color: #475569;
  cursor: pointer;
  font-size: 13px;
  padding: 0 8px;
`;

export const AddItemRow = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

export const AddItemInput = styled(ItemInput)`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #334155;
`;

export const AddItemBtn = styled.button`
  padding: 6px 12px;
  background: #1e3a5f;
  border: 1px solid #60a5fa;
  border-radius: 6px;
  color: #60a5fa;
  font-size: 12px;
  cursor: pointer;
`;
