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

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const HelpBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1e293b;
  border: 1px solid #334155;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const HelpOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const HelpModal = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 28px;
  width: 480px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
`;

export const HelpModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const HelpModalTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
`;

export const HelpModalClose = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 18px;
  padding: 2px 6px;
  line-height: 1;
`;

export const HelpStep = styled.div`
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #0f172a;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

export const HelpStepIcon = styled.div`
  font-size: 22px;
  flex-shrink: 0;
  width: 32px;
  text-align: center;
  margin-top: 1px;
`;

export const HelpStepBody = styled.div``;

export const HelpStepTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
`;

export const HelpStepDesc = styled.div`
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
`;
