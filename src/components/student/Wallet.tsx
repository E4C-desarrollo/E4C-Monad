import { useState, useEffect, useCallback } from 'react';
import { Award, ArrowRight, Hourglass, ExternalLink, ShieldCheck, Wallet as WalletIcon } from 'lucide-react';
import { type Student, type NFT } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import MonLogo from '../../assets/monad/Tokens/MON Token 32x32.svg';
import { 
  getMonadNativeBalance, 
  connectMonadWallet, 
  formatMonadAddress 
} from '../../lib/monad/provider';
import { MONAD_TESTNET } from '../../lib/monad/chain';

interface WalletProps {
  studentId: string;
  onViewNFT: (nftId: string) => void;
  onNavigateToMarketplace: () => void;
}

export function Wallet({ studentId, onViewNFT, onNavigateToMarketplace }: WalletProps) {
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [e4cBalance, setE4cBalance] = useState<string>('0');
  const [monBalance, setMonBalance] = useState<string>('0.0000');
  const [monadAddress, setMonadAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [nfts, setNfts] = useState<NFT[]>([]);

  const fetchWalletData = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    try {
      // 1. Obtener datos del perfil en Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .single();

      if (profileError) throw profileError;
      const student = profile as Student;
      setStudentData(student);

      // Si el alumno tiene tokens en su perfil, inicializar
      if (student.tokens !== undefined) {
        setE4cBalance(student.tokens.toString());
      }

      // Si tiene dirección de Monad guardada o conectada
      const activeAddress = (student as any).monad_address || (window.ethereum?.selectedAddress);
      if (activeAddress) {
        setMonadAddress(activeAddress);
        const bal = await getMonadNativeBalance(activeAddress);
        setMonBalance(bal);
      }

      // NFTs / Certificaciones de Habilidades
      setNfts([]);

    } catch (err) {
      console.error("Error cargando billetera en Monad:", err);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleLinkMonadWallet = async () => {
    setLinking(true);
    try {
      const address = await connectMonadWallet();
      setMonadAddress(address);
      const bal = await getMonadNativeBalance(address);
      setMonBalance(bal);

      // Guardar en el perfil de Supabase si existe la columna
      try {
        await supabase
          .from('profiles')
          .update({ monad_address: address })
          .eq('id', studentId);
      } catch (dbErr) {
        console.warn('Campo monad_address no disponible aún en profiles, usando local:', dbErr);
      }

      alert(`¡Billetera Monad vinculada con éxito!\n${address}`);
    } catch (err: any) {
      alert(err.message || 'Error al vincular billetera Monad');
    } finally {
      setLinking(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center p-12">
      <Hourglass className="animate-spin text-monad-purple mr-2" />
      <span>Cargando tu billetera en Monad...</span>
    </div>
  );

  if (!studentData) return <div className="text-center py-8 text-red-600">No se pudo cargar la información del alumno.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Mi Billetera Digital</h2>
          <p className="text-sm text-gray-500">Acreditaciones y recompensas tokenizadas en Monad Network</p>
        </div>

        {/* Estado de conexión Monad */}
        <div className="flex items-center gap-3">
          {monadAddress ? (
            <div className="flex items-center gap-2 bg-monad-void px-3 py-1.5 rounded-xl border border-monad-purple/40 text-white text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-monad-cyan">{formatMonadAddress(monadAddress)}</span>
              <a
                href={`${MONAD_TESTNET.blockExplorerUrls[0]}/address/${monadAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver en Monad Explorer"
                className="hover:text-monad-purple-light ml-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <button
              onClick={handleLinkMonadWallet}
              disabled={linking}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-monad-purple hover:bg-monad-purple-hover text-white text-xs font-semibold shadow-md transition-all"
            >
              <WalletIcon className="w-4 h-4" />
              <span>{linking ? 'Vinculando...' : 'Vincular Billetera Monad'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tarjetas de Balances en Monad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance de Tokens E4C (Puntos Educativos) */}
        <div className="bg-gradient-to-br from-monad-purple via-[#7259ea] to-monad-purple-deep rounded-2xl p-7 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-white/90 text-sm">Créditos de Habilidades</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">ERC-20</span>
          </div>

          <p className="text-4xl font-black mb-6 font-mono tracking-tight">
            {e4cBalance} <span className="text-lg font-normal text-white/80">E4C</span>
          </p>
          
          <button
            onClick={onNavigateToMarketplace}
            className="bg-white text-monad-purple px-5 py-2.5 rounded-xl font-bold hover:bg-monad-off-white transition-all flex items-center gap-2 shadow-lg text-sm"
          >
            <span>Canjear por Recompensas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Nativo MON (Gas & Staking de Monad) */}
        <div className="bg-monad-void border border-monad-purple/30 rounded-2xl p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <img src={MonLogo} alt="MON" className="w-8 h-8 rounded-full shadow-md" />
                <div>
                  <span className="font-medium text-white/90 text-sm block">Monad Nativo</span>
                  <span className="text-xs text-monad-purple-light">Monad Testnet (Chain ID 10143)</span>
                </div>
              </div>
              <span className="text-xs bg-monad-purple/30 text-monad-cyan px-2 py-0.5 rounded-full font-mono">L1 Gas</span>
            </div>

            <p className="text-4xl font-black mb-2 font-mono tracking-tight text-white">
              {monBalance} <span className="text-lg font-normal text-monad-cyan">MON</span>
            </p>
            <p className="text-xs text-gray-400">Utilizado para validar transacciones ultra-rápidas (10k TPS) y acuñar certificados.</p>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <a
              href={MONAD_TESTNET.faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-monad-purple/20 hover:bg-monad-purple/30 text-monad-purple-light text-xs font-semibold border border-monad-purple/40 transition-all"
            >
              <span>Solicitar en Faucet Oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* NFTs de Mérito / Soulbound Skill Badges */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50/60 to-pink-50/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-monad-purple/10 text-monad-purple rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold">Certificaciones de Habilidades (Soulbound Tokens)</h3>
                <p className="text-xs text-gray-500">Insignias intransferibles acuñadas en Monad</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-monad-purple/10 text-monad-purple rounded-full text-xs font-bold font-mono">
              {nfts.length} Acreditadas
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {nfts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3 grayscale opacity-40">🏆</div>
              <p className="text-gray-800 font-semibold mb-1">
                Aún no tienes insignias acuñadas en Monad.
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Completa tareas escolares asignadas por tus docentes. Al ser validadas, recibirás tus insignias SBT y créditos E4C on-chain.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nfts.map(nft => (
                <button
                  key={nft.id}
                  onClick={() => onViewNFT(nft.id)}
                  className="p-6 border border-gray-200 rounded-xl hover:border-monad-purple hover:shadow-lg transition-all text-center bg-white group"
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-105 transition-transform">{nft.image}</div>
                  <h4 className="text-gray-900 font-bold mb-1">{nft.name}</h4>
                  <div className={`inline-flex px-2.5 py-0.5 rounded-full text-xs mb-2 font-bold ${
                    nft.category === 'excellence' ? 'bg-amber-100 text-amber-800' : 'bg-monad-purple/10 text-monad-purple'
                  }`}>
                    {nft.category === 'excellence' ? 'Excelencia' : 'Competencia'}
                  </div>
                  <p className="text-gray-500 text-xs">{nft.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}