import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0f172a;
  color: #f1f5f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

export const Header = styled.div`
  height: 52px;
  border-bottom: 1px solid #1e293b;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

export const WorkspaceBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #111827;
`;

export const CanvasLoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #475569;
`;

export const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 10px 20px;
  color: #f1f5f9;
  font-size: 13px;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`;

export const StyledHeaderBtn = styled.button<{ $danger?: boolean }>`
  padding: 5px 14px;
  background: ${({ $danger }) => ($danger ? '#1f1010' : '#1e293b')};
  border: 1px solid ${({ $danger }) => ($danger ? '#7f1d1d' : '#334155')};
  border-radius: 7px;
  color: ${({ $danger }) => ($danger ? '#fca5a5' : '#94a3b8')};
  font-size: 12px;
  cursor: pointer;
`;
