import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Layers, Server, Share2, GitFork, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_VPCS } from '../../data/mockVpcs';
import { MOCK_EC2_INSTANCES } from '../../data/mockEc2';
import { MOCK_TRANSIT_GATEWAY, MOCK_ROUTE_TABLES } from '../../data/mockTransitGateway';

export const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase().trim();
    const hits = [];

    // Search VPCs
    MOCK_VPCS.forEach((vpc) => {
      if (
        vpc.name.toLowerCase().includes(q) ||
        vpc.displayName.toLowerCase().includes(q) ||
        vpc.cidr.includes(q) ||
        vpc.id.toLowerCase().includes(q)
      ) {
        hits.push({
          type: 'VPC',
          title: `${vpc.displayName} (${vpc.name})`,
          subtitle: `${vpc.id} • ${vpc.cidr}`,
          icon: Layers,
          path: '/vpcs',
          badge: vpc.status,
          badgeColor: vpc.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        });
      }
    });

    // Search EC2
    MOCK_EC2_INSTANCES.forEach((ec2) => {
      if (
        ec2.name.toLowerCase().includes(q) ||
        ec2.id.toLowerCase().includes(q) ||
        ec2.privateIp.includes(q) ||
        ec2.publicIp.includes(q) ||
        ec2.environment.toLowerCase().includes(q)
      ) {
        hits.push({
          type: 'EC2',
          title: ec2.name,
          subtitle: `${ec2.id} • ${ec2.privateIp} • ${ec2.environment}`,
          icon: Server,
          path: '/ec2',
          badge: ec2.state,
          badgeColor: 'bg-emerald-50 text-emerald-700'
        });
      }
    });

    // Search Transit Gateway
    if (
      MOCK_TRANSIT_GATEWAY.name.toLowerCase().includes(q) ||
      MOCK_TRANSIT_GATEWAY.id.toLowerCase().includes(q) ||
      'transit gateway'.includes(q) ||
      'tgw'.includes(q)
    ) {
      hits.push({
        type: 'Transit Gateway',
        title: MOCK_TRANSIT_GATEWAY.name,
        subtitle: `${MOCK_TRANSIT_GATEWAY.id} • ${MOCK_TRANSIT_GATEWAY.region} • ASN ${MOCK_TRANSIT_GATEWAY.asn}`,
        icon: Share2,
        path: '/transit-gateway',
        badge: MOCK_TRANSIT_GATEWAY.state,
        badgeColor: 'bg-blue-50 text-blue-700'
      });
    }

    // Search Route Tables
    MOCK_ROUTE_TABLES.forEach((rt) => {
      if (
        rt.name.toLowerCase().includes(q) ||
        rt.id.toLowerCase().includes(q) ||
        rt.vpcName.toLowerCase().includes(q)
      ) {
        hits.push({
          type: 'Route Table',
          title: rt.name,
          subtitle: `${rt.id} • Associated with ${rt.vpcName}`,
          icon: GitFork,
          path: '/route-tables',
          badge: `${rt.routes.length} routes`,
          badgeColor: 'bg-indigo-50 text-indigo-700'
        });
      }
    });

    setResults(hits);
    setIsOpen(hits.length > 0);
  }, [query]);

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery('');
    navigate(item.path);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          placeholder="Search VPC, EC2, TGW, Route Tables..."
          className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>Search Results ({results.length})</span>
            <span className="text-[10px] text-slate-400 lowercase font-normal">click to inspect</span>
          </div>
          <div className="divide-y divide-slate-100">
            {results.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">{item.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
