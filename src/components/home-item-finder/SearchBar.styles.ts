import styled from 'styled-components';

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 480px;
`;

export const SearchInputWrapper = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  background: #1e293b;
  border: 1px solid ${({ $open }) => ($open ? '#60a5fa' : '#334155')};
  border-radius: 8px;
  padding: 6px 12px;
  gap: 8px;
`;

export const SearchIcon = styled.span`
  color: #64748b;
  font-size: 14px;
`;

export const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-size: 13px;
`;

export const ClearBtn = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  z-index: 200;
  max-height: 360px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

export const EmptyResult = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: #475569;
`;

export const EmptyResultIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

export const EmptyResultText = styled.div`
  font-size: 13px;
`;

export const ResultItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 1px solid #0f172a;
  cursor: pointer;
  text-align: left;
  display: block;
`;

export const ResultName = styled.div`
  font-size: 13px;
  color: #f1f5f9;
  font-weight: 600;
`;

export const ResultPath = styled.div`
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
`;

export const ResultMemo = styled.div`
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
`;

export const ResultTags = styled.div`
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

export const HighlightMark = styled.mark`
  background: #fbbf24;
  color: #0f172a;
  border-radius: 2px;
  padding: 0 1px;
`;
