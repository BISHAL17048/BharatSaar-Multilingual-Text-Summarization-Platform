import { Activity, HardDrive, Cpu, Server } from 'lucide-react';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">System Settings & Monitor</h1>
        <p className="text-muted">Manage your AI pipeline resources and user preferences.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* GPU Usage */}
        <div className="bg-surface/30 p-6 rounded-2xl border border-surface/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Cpu className="w-32 h-32 text-primary" />
          </div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-primary" /> GPU VRAM Usage
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">NVIDIA RTX 4090 (24GB)</span>
                <span className="font-mono text-primary">18.4 GB / 24 GB</span>
              </div>
              <div className="w-full bg-surface rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{width: '76%'}}></div>
              </div>
            </div>
            <div className="text-xs text-muted space-y-2 mt-4 pt-4 border-t border-surface/50">
              <div className="flex justify-between"><span>Loaded: Qwen3-4B-Instruct</span><span>6.8 GB</span></div>
              <div className="flex justify-between"><span>Loaded: BGE-M3</span><span>4.2 GB</span></div>
              <div className="flex justify-between"><span>Loaded: GLiNER multi-v2.1</span><span>2.1 GB</span></div>
            </div>
          </div>
        </div>

        {/* Memory & Queue */}
        <div className="space-y-6">
          <div className="bg-surface/30 p-6 rounded-2xl border border-surface/50 backdrop-blur-sm">
             <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-secondary" /> System RAM
            </h3>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-muted">Usage</span>
                <span className="font-mono text-secondary">32 GB / 64 GB</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2.5">
              <div className="bg-secondary h-2.5 rounded-full" style={{width: '50%'}}></div>
            </div>
          </div>

          <div className="bg-surface/30 p-6 rounded-2xl border border-surface/50 backdrop-blur-sm">
             <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-success" /> Celery Queue Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface/50 p-4 rounded-xl border border-surface/50">
                <div className="text-muted text-xs uppercase tracking-wider mb-1">Active Tasks</div>
                <div className="text-2xl font-bold text-textPrimary">3</div>
              </div>
              <div className="bg-surface/50 p-4 rounded-xl border border-surface/50">
                <div className="text-muted text-xs uppercase tracking-wider mb-1">Pending</div>
                <div className="text-2xl font-bold text-textPrimary">14</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
