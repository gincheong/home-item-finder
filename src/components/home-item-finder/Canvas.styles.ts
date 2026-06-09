import styled from 'styled-components';

export const ContextMenu = styled.div`
  position: absolute;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 4px 0;
  z-index: 400;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

export const ContextMenuLabel = styled.div`
  padding: 6px 14px 8px;
  font-size: 11px;
  color: #64748b;
  border-bottom: 1px solid #334155;
  font-weight: 600;
`;

export const ContextMenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 9px 14px;
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
`;

export const ContextMenuDeleteItem = styled(ContextMenuItem)`
  color: #f87171;
`;

export const EmptyStateWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const EmptyStateInner = styled.div`
  text-align: center;
  color: #475569;
`;

export const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

export const EmptyStateTitle = styled.div`
  font-size: 16px;
`;

export const EmptyStateSubtitle = styled.div`
  font-size: 13px;
  margin-top: 4px;
`;

export const DrawingHint = styled.div`
  position: absolute;
  bottom: 56px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  border: 1px solid #60a5fa;
  border-radius: 8px;
  padding: 8px 20px;
  color: #60a5fa;
  font-size: 13px;
  pointer-events: none;
`;

export const ZoomControls = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 4px 8px;
`;

export const ZoomBtn = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px 4px;
  border-radius: 4px;
`;

export const ZoomResetBtn = styled(ZoomBtn)`
  font-size: 11px;
  color: #64748b;
`;

export const ZoomLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
  min-width: 40px;
  text-align: center;
`;

export const ZoomDivider = styled.div`
  width: 1px;
  height: 16px;
  background: #334155;
  margin: 0 2px;
`;

export const PanHint = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #334155;
  pointer-events: none;
`;
