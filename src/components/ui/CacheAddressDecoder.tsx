import { useEffect, useMemo, useState } from 'react';
import type {
  AddressBreakdown,
  CacheMappingType,
} from '../../types';
import { ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface CacheAddressDecoderProps {
  mappingType: CacheMappingType;
  onAddressChange: (breakdown: AddressBreakdown) => void;
}

export const CacheAddressDecoder = ({
  mappingType,
  onAddressChange,
}: CacheAddressDecoderProps) => {
  const [hexInput, setHexInput] = useState('4A8F');

  // =========================================================
  // Calculate the cache address breakdown
  // =========================================================

  const computeBreakdown = (
    hex: string
  ): AddressBreakdown => {
    let cleanHex = hex
      .replace(/[^0-9A-Fa-f]/g, '')
      .slice(0, 4);

    if (cleanHex.length === 0) {
      cleanHex = '0000';
    }

    const num = parseInt(cleanHex, 16) || 0;

    const bin = num
      .toString(2)
      .padStart(16, '0');

    let tag = '';
    let index = '';
    let offset = '';

    // -1 means there is no fixed cache index.
    let calculatedIdx = -1;

    // =======================================================
    // DIRECT MAPPED
    // Tag = 9 bits
    // Index = 3 bits
    // Offset = 4 bits
    // =======================================================

    if (mappingType === 'direct') {
      tag = bin.slice(0, 9);
      index = bin.slice(9, 12);
      offset = bin.slice(12, 16);

      calculatedIdx = parseInt(index, 2);
    }

    // =======================================================
    // SET ASSOCIATIVE
    // Tag = 10 bits
    // Index = 2 bits
    // Offset = 4 bits
    //
    // 2 index bits = 4 sets
    // Assuming 2-way associativity:
    //
    // Set 0 -> lines 0,1
    // Set 1 -> lines 2,3
    // Set 2 -> lines 4,5
    // Set 3 -> lines 6,7
    // =======================================================

    else if (mappingType === 'set-associative') {
      tag = bin.slice(0, 10);
      index = bin.slice(10, 12);
      offset = bin.slice(12, 16);

      const setIndex = parseInt(index, 2);

      calculatedIdx = setIndex * 2;
    }

    // =======================================================
    // FULLY ASSOCIATIVE
    // Tag = 12 bits
    // Index = NONE
    // Offset = 4 bits
    //
    // There is no fixed index.
    // The block can be placed in ANY cache line.
    // =======================================================

    else {
      tag = bin.slice(0, 12);
      index = 'NONE';
      offset = bin.slice(12, 16);

      calculatedIdx = -1;
    }

    const calculatedTag =
      parseInt(tag, 2) || 0;

    return {
      addressHex: `0x${cleanHex.toUpperCase()}`,
      addressBin: bin,
      tagBits: tag,
      indexBits: index,
      offsetBits: offset,
      calculatedIndex: calculatedIdx,
      calculatedTagHex:
        `0x${calculatedTag
          .toString(16)
          .toUpperCase()}`,
    };
  };

  // =========================================================
  // Calculate current address
  // =========================================================

  const currentBreakdown = useMemo(
    () => computeBreakdown(hexInput),
    [hexInput, mappingType]
  );

  // =========================================================
  // Send updated address information to App.tsx
  // =========================================================

  useEffect(() => {
    onAddressChange(currentBreakdown);
  }, [currentBreakdown, onAddressChange]);

  // =========================================================
  // Determine target line/set display
  // =========================================================

  const getTargetDisplay = (): string => {
    if (mappingType === 'fully-associative') {
      return 'ANY LINE';
    }

    if (mappingType === 'set-associative') {
      const start =
        currentBreakdown.calculatedIndex;

      return `SET → LINES ${start}, ${start + 1}`;
    }

    return `LINE #${currentBreakdown.calculatedIndex}`;
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="glass-panel-glow p-5 rounded-2xl border-cyan-500/30">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-mono font-bold text-cyan-300 tracking-wider">
            CACHE ADDRESS TRANSLATION DECODER
          </h2>

          <p className="text-[10px] text-slate-500 mt-1">
            16-bit CPU address decomposition
          </p>
        </div>
      </div>


      {/* =====================================================
          PRESET ADDRESSES
          ===================================================== */}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-slate-500">
          Presets:
        </span>

        {['4A8F', '1F2A', '8C00'].map(
          (preset) => (
            <button
              key={preset}
              onClick={() => {
                soundFx.playClick();
                setHexInput(preset);
              }}
              className="px-2 py-1 rounded text-[10px] glass-panel text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              0x{preset}
            </button>
          )
        )}
      </div>


      {/* =====================================================
          ADDRESS INPUT
          ===================================================== */}

      <div className="flex items-center space-x-3 mb-4">

        <span className="text-xs text-slate-400">
          16-Bit Hex Address:
        </span>

        <input
          type="text"
          maxLength={4}
          value={hexInput}
          onChange={(event) => {
            const value =
              event.target.value
                .toUpperCase()
                .replace(/[^0-9A-F]/g, '')
                .slice(0, 4);

            setHexInput(value);
          }}
          className="w-24 bg-slate-900 border border-cyan-500/50 rounded-lg px-3 py-1.5 text-cyan-300 font-bold text-sm tracking-widest focus:outline-none focus:border-cyan-400"
        />

        <ArrowRight className="w-4 h-4 text-cyan-400" />

        <span className="text-xs text-slate-300 font-bold tracking-wide">
          {currentBreakdown.addressBin}
        </span>

        <span className="text-[10px] text-slate-500">
          (Binary)
        </span>

      </div>


      {/* =====================================================
          BIT FIELD DECODING
          ===================================================== */}

      <div className="grid grid-cols-3 gap-3 text-center">

        {/* ===================================================
            TAG
            =================================================== */}

        <div className="glass-panel p-3 rounded-xl border-purple-500/40">

          <div className="text-[10px] text-purple-400 font-bold mb-1">
            TAG BITS
          </div>

          <div className="text-xs text-white font-bold tracking-wider break-all">
            {currentBreakdown.tagBits}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            Identifies Block
          </div>

          <div className="text-[10px] text-purple-300 mt-2 font-mono">
            {currentBreakdown.calculatedTagHex}
          </div>

        </div>


        {/* ===================================================
            INDEX
            =================================================== */}

        <div className="glass-panel p-3 rounded-xl border-cyan-500/40">

          <div className="text-[10px] text-cyan-400 font-bold mb-1">
            INDEX BITS
          </div>

          <div className="text-xs text-white font-bold tracking-wider break-all">
            {currentBreakdown.indexBits}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            {getTargetDisplay()}
          </div>

        </div>


        {/* ===================================================
            OFFSET
            =================================================== */}

        <div className="glass-panel p-3 rounded-xl border-emerald-500/40">

          <div className="text-[10px] text-emerald-400 font-bold mb-1">
            OFFSET BITS
          </div>

          <div className="text-xs text-white font-bold tracking-wider">
            {currentBreakdown.offsetBits}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            Byte Location
          </div>

        </div>

      </div>


      {/* =====================================================
          MAPPING EXPLANATION
          ===================================================== */}

      <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">

        <div className="text-[10px] text-slate-400 font-mono">

          {mappingType === 'direct' && (
            <>
              <span className="text-cyan-400 font-bold">
                DIRECT MAPPED:
              </span>{' '}
              Address selects exactly one cache line.
            </>
          )}

          {mappingType === 'set-associative' && (
            <>
              <span className="text-blue-400 font-bold">
                SET ASSOCIATIVE:
              </span>{' '}
              Address selects one set, then the block can
              occupy any way inside that set.
            </>
          )}

          {mappingType === 'fully-associative' && (
            <>
              <span className="text-purple-400 font-bold">
                FULLY ASSOCIATIVE:
              </span>{' '}
              No index is used. The block can occupy any
              cache line.
            </>
          )}

        </div>

      </div>

    </div>
  );
};