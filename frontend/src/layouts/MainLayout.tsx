import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Settings, PanelLeftClose, PanelLeft, Trash2, Pencil, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { useHistory } from '../contexts/HistoryContext';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { refreshCounter } = useHistory();

  // Rename state
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get(`${ENDPOINTS.DOCUMENTS.GET_ALL}?user_id=mock_user_123`);
        if (response.data.success && response.data.data.documents) {
          setHistoryItems(response.data.data.documents);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      }
    };
    fetchHistory();
  }, [location.pathname, refreshCounter]); // Refetch on navigation change OR when a document completes

  // Focus the rename input whenever renaming starts
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const startRename = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    setRenamingId(item._id || item.id);
    // Pre-fill with display_name if user has renamed before, else fall back to AI headline or original name
    setRenameValue(item.display_name || item.headline || item.original_name || 'Document');
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue('');
  };

  const commitRename = async (docId: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed) { cancelRename(); return; }

    // Optimistically update UI
    setHistoryItems(prev =>
      prev.map(item =>
        (item._id || item.id) === docId ? { ...item, display_name: trimmed } : item
      )
    );
    setRenamingId(null);
    setRenameValue('');

    try {
      await apiClient.patch(ENDPOINTS.DOCUMENTS.RENAME(docId), { name: trimmed });
    } catch (err) {
      console.error("Failed to rename document", err);
      // Revert on failure by re-fetching
      const response = await apiClient.get(`${ENDPOINTS.DOCUMENTS.GET_ALL}?user_id=mock_user_123`);
      if (response.data.success && response.data.data.documents) {
        setHistoryItems(response.data.data.documents);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await apiClient.delete(`/documents/${docId}`);
      if (res.data.success) {
        setHistoryItems(prev => prev.filter(item => (item._id || item.id) !== docId));
        if (location.pathname.includes(docId)) {
          navigate('/');
        }
      }
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  return (
    <div className="flex h-screen bg-background text-textPrimary font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-surface flex flex-col flex-shrink-0 border-r border-secondary overflow-hidden"
      >
        <div className="w-[260px] flex flex-col h-full">
          <div className="p-3 flex flex-col space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="font-semibold text-lg">BharatSaar</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-secondary rounded-md text-muted hover:text-textPrimary transition-colors"
                title="Close Sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>
            <Link 
              to="/"
              className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-secondary transition-colors group text-textPrimary"
            >
              <div className="flex items-center">
                <span className="font-medium text-sm">New Analysis</span>
              </div>
              <Plus className="w-4 h-4 text-muted group-hover:text-textPrimary transition-colors" />
            </Link>
          </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="text-xs font-semibold text-muted px-3 mb-2 mt-4">Today</div>
          <nav className="space-y-1">
            {historyItems.map((item) => {
              const docId = item._id || item.id;
              const isRenaming = renamingId === docId;

              return (
                <div key={docId} className="group relative flex items-center rounded-lg">
                  {isRenaming ? (
                    /* ── Rename mode ── */
                    <div className="flex items-center w-full px-2 py-1.5 gap-1">
                      <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename(docId);
                          if (e.key === 'Escape') cancelRename();
                        }}
                        onBlur={() => commitRename(docId)}
                        className="flex-1 bg-zinc-800 text-textPrimary text-sm px-2 py-1 rounded-md border border-zinc-600 focus:outline-none focus:border-primary min-w-0"
                        maxLength={80}
                      />
                      <button
                        onMouseDown={(e) => { e.preventDefault(); commitRename(docId); }}
                        className="p-1 hover:bg-zinc-700 rounded text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onMouseDown={(e) => { e.preventDefault(); cancelRename(); }}
                        className="p-1 hover:bg-zinc-700 rounded text-muted hover:text-red-400 transition-colors flex-shrink-0"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    /* ── Normal mode ── */
                    <>
                      <Link
                        to={`/document/${item.job_id || item._id}`}
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-textPrimary hover:bg-secondary transition-colors w-full"
                      >
                        <span className="truncate pr-14">{item.display_name || item.headline || item.original_name || 'Document'}</span>
                      </Link>
                      {/* Action buttons — visible on hover */}
                      <div className="absolute right-1 hidden group-hover:flex items-center gap-0.5 bg-gradient-to-l from-secondary via-secondary to-transparent pl-4">
                        <button
                          onClick={(e) => startRename(e, item)}
                          className="p-1.5 hover:bg-zinc-700 rounded-md transition-all text-muted hover:text-textPrimary"
                          title="Rename"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, docId)}
                          className="p-1.5 hover:bg-zinc-700 rounded-md transition-all text-muted hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-secondary">
          <button className="flex items-center w-full px-3 py-3 text-sm text-textPrimary hover:bg-secondary rounded-lg transition-colors">
            <Settings className="w-4 h-4 mr-3 text-muted" />
            Settings
          </button>
          <button className="flex items-center w-full px-3 py-3 text-sm text-textPrimary hover:bg-secondary rounded-lg transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mr-2 flex-shrink-0"></div>
            <span className="truncate">Bishal Ray</span>
          </button>
        </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Floating Open Button (visible only when sidebar is closed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-50 p-2 bg-surface border border-secondary rounded-md text-muted hover:text-textPrimary shadow-sm transition-all"
            title="Open Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}
