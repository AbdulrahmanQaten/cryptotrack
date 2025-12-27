import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useWalletData,
  useWalletTransactions,
  NETWORKS,
  NetworkType,
} from "@/hooks/useBlockchainData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  DollarSign,
  Hash,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const WalletTracker = () => {
  usePageTitle("title.wallet");
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [searchAddress, setSearchAddress] = useState(address || "");
  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkType>("ethereum");

  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
  } = useWalletData(address || "", selectedNetwork);
  const { data: transactions, isLoading: txLoading } = useWalletTransactions(
    address || "",
    selectedNetwork
  );

  const handleSearch = () => {
    if (searchAddress && searchAddress.length === 42) {
      navigate(`/wallet/${searchAddress}`);
    } else {
      toast({
        title: t("wallet.invalidAddress"),
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("wallet.copied") });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const currentNetwork = NETWORKS[selectedNetwork];

  return (
    <div className="container mx-auto px-4 py-8" dir={dir}>
      {/* Search Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Wallet className="h-8 w-8 text-primary" />
          {t("wallet.title")}
        </h1>
        <p className="text-muted-foreground mb-6">{t("wallet.subtitle")}</p>

        <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
          <Select
            value={selectedNetwork}
            onValueChange={(v) => setSelectedNetwork(v as NetworkType)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(NETWORKS).map((net) => (
                <SelectItem key={net.id} value={net.id}>
                  {net.name} ({net.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder={t("wallet.enterAddress")}
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="font-mono text-sm flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 me-2" />
            {t("wallet.search")}
          </Button>
        </div>
      </div>

      {/* Wallet Data */}
      {address && (
        <>
          {walletLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : walletError ? (
            <Card className="border-destructive">
              <CardContent className="py-8 text-center text-destructive">
                {t("wallet.error")}
              </CardContent>
            </Card>
          ) : (
            walletData && (
              <>
                {/* Wallet Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t("wallet.network")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        variant="secondary"
                        className="text-base px-3 py-1"
                      >
                        {currentNetwork.name}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t("wallet.address")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm truncate">
                          {formatAddress(walletData.address)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(walletData.address)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t("wallet.balance")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {walletData.balance} {currentNetwork.symbol}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />$
                        {walletData.balanceUsd.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t("wallet.txCount")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {walletData.transactionCount}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Transactions List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      {t("wallet.transactions")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {txLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : transactions && transactions.length > 0 ? (
                      <div className="space-y-3">
                        {transactions.map((tx) => (
                          <Link
                            key={tx.hash}
                            to={`/transaction/${tx.hash}?network=${selectedNetwork}`}
                            className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-full ${
                                    tx.isIncoming
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-red-500/10 text-red-500"
                                  }`}
                                >
                                  {tx.isIncoming ? (
                                    <ArrowDownLeft className="h-4 w-4" />
                                  ) : (
                                    <ArrowUpRight className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-mono text-sm">
                                    {formatAddress(tx.hash)}
                                  </p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(tx.timestamp)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-end">
                                  <p
                                    className={`font-semibold ${
                                      tx.isIncoming
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {tx.isIncoming ? "+" : "-"}
                                    {tx.value} {currentNetwork.symbol}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${tx.valueUsd.toFixed(2)}
                                  </p>
                                </div>

                                <Badge
                                  variant={
                                    tx.status === "success"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="gap-1"
                                >
                                  {tx.status === "success" ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : (
                                    <XCircle className="h-3 w-3" />
                                  )}
                                  {tx.status === "success"
                                    ? t("wallet.success")
                                    : t("wallet.failed")}
                                </Badge>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        {t("wallet.noTransactions")}
                      </p>
                    )}

                    {address && (
                      <div className="mt-4 text-center">
                        <a
                          href={`${currentNetwork.explorer}/address/${address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline"
                        >
                          {t("wallet.viewOnExplorer")} ({currentNetwork.name})
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )
          )}
        </>
      )}

      {/* Empty State */}
      {!address && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">
              {t("wallet.emptyTitle")}
            </h3>
            <p className="text-muted-foreground">
              {t("wallet.emptyDescription")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WalletTracker;
