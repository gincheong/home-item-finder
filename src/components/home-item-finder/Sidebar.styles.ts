import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 240px;
  flex-shrink: 0;
  background: #0f172a;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const SidebarHeader = styled.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid #1e293b;
`;

export const SidebarTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 2px;
`;

export const SidebarSubtitle = styled.div`
  font-size: 11px;
  color: #64748b;
`;

export const SidebarBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

export const SectionWrapper = styled.div`
  margin-bottom: 16px;
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

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AddRoomBtn = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: #1e3a5f;
  border: 1px dashed #60a5fa;
  border-radius: 8px;
  color: #60a5fa;
  font-size: 12px;
  cursor: pointer;
  text-align: center;
`;

export const EmptyRooms = styled.div`
  font-size: 12px;
  color: #475569;
  text-align: center;
  padding: 8px 0;
`;

export const RoomBtn = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 7px 10px;
  border: 1px solid ${({ $selected }) => ($selected ? '#60a5fa' : '#334155')};
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ $selected }) => ($selected ? '#1e3a5f' : '#1e293b')};
  color: ${({ $selected }) => ($selected ? '#60a5fa' : '#cbd5e1')};
`;

export const RoomDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: inline-block;
  flex-shrink: 0;
`;

export const FurnitureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
`;

export const FurnitureBtn = styled.button`
  padding: 10px 8px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #cbd5e1;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const FurnitureBtnIcon = styled.span`
  font-size: 18px;
`;

export const FurnitureBtnLabel = styled.span`
  font-size: 11px;
`;

export const SelectedInfo = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

export const SelectedInfoName = styled.div`
  color: #f1f5f9;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const DeleteRoomBtn = styled.button`
  margin-top: 8px;
  width: 100%;
  padding: 6px 10px;
  background: none;
  border: 1px solid #7f1d1d;
  border-radius: 7px;
  color: #f87171;
  font-size: 11px;
  cursor: pointer;
  text-align: center;
`;

export const RoomNameInput = styled.input`
  width: 100%;
  background: #0f172a;
  border: 1px solid #60a5fa;
  border-radius: 5px;
  padding: 3px 7px;
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  box-sizing: border-box;
  outline: none;
`;

export const RoomNameBtn = styled.button`
  display: block;
  width: 100%;
  background: none;
  border: none;
  padding: 3px 0;
  color: #f1f5f9;
  font-weight: 600;
  font-size: 13px;
  cursor: text;
  text-align: left;
  margin-bottom: 4px;
`;
