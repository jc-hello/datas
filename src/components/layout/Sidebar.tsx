import { BaseAssetToggle } from "@/components/controls/BaseAssetToggle";
import { TimeframeSelector } from "@/components/controls/TimeframeSelector";
import { ExchangeSelector } from "@/components/controls/ExchangeSelector";
import { MethodToggle } from "@/components/controls/MethodToggle";
import { SymbolSearch } from "@/components/controls/SymbolSearch";
import { TerminalPanel } from "@/components/ui/TerminalPanel";

export function Sidebar() {
  return (
    <TerminalPanel title="CONFIG" className="h-full">
      <div className="space-y-4">
        <BaseAssetToggle />
        <TimeframeSelector />
        <ExchangeSelector />
        <MethodToggle />
        <SymbolSearch />
      </div>
    </TerminalPanel>
  );
}
