import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  useTransactionDetails,
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
  Search,
  Loader2,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  ArrowRight,
  Clock,
  Fuel,
  Hash,
  Box,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TransactionExplorer = () => {
  usePageTitle("title.transaction");
  const { hash } = useParams<{ hash: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [searchHash, setSearchHash] = useState(hash || "");
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(
    (searchParams.get("network") as NetworkType) || "ethereum"
  );

  const {
    data: txDetails,
    isLoading,
    error,
  } = useTransactionDetails(hash || "", selectedNetwork);

  useEffect(() => {
    const networkParam = searchParams.get("network") as NetworkType;
    if (networkParam && NETWORKS[networkParam]) {
      setSelectedNetwork(networkParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (searchHash && searchHash.length === 66) {
      navigate(`/transaction/${searchHash}?network=${selectedNetwork}`);
    } else {
      toast({
        title: t("transaction.invalidHash"),
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t("wallet.copied") });
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr === "Contract Creation") return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
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
          <Search className="h-8 w-8 text-primary" />
          {t("transaction.title")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("transaction.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-2 max-w-3xl">
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
            placeholder={t("transaction.enterHash")}
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            className="font-mono text-sm flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 me-2" />
            {t("transaction.search")}
          </Button>
        </div>
      </div>

      {/* Transaction Details */}
      {hash && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="border-destructive">
              <CardContent className="py-8 text-center text-destructive">
                {t("transaction.error")}
              </CardContent>
            </Card>
          ) : (
            txDetails && (
              <div className="space-y-6">
                {/* Status Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        {t("transaction.details")}
                        <Badge variant="outline" className="ms-2">
                          {currentNetwork.name}
                        </Badge>
                      </CardTitle>
                      <Badge
                        variant={
                          txDetails.status === "success"
                            ? "default"
                            : "destructive"
                        }
                        className="gap-1 text-sm px-3 py-1"
                      >
                        {txDetails.status === "success" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        {txDetails.status === "success"
                          ? t("transaction.success")
                          : t("transaction.failed")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Transaction Hash */}
                      <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {t("transaction.hash")}
                          </p>
                          <p className="font-mono text-sm break-all">
                            {txDetails.hash}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(txDetails.hash)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* From -> To */}
                      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">
                            {t("transaction.from")}
                          </p>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/wallet/${txDetails.from}?network=${selectedNetwork}`}
                              className="font-mono text-sm text-primary hover:underline"
                            >
                              {formatAddress(txDetails.from)}
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(txDetails.from)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />

                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-1">
                            {t("transaction.to")}
                          </p>
                          <div className="flex items-center gap-2">
                            {txDetails.to === "Contract Creation" ? (
                              <span className="font-mono text-sm">
                                {txDetails.to}
                              </span>
                            ) : (
                              <>
                                <Link
                                  to={`/wallet/${txDetails.to}?network=${selectedNetwork}`}
                                  className="font-mono text-sm text-primary hover:underline"
                                >
                                  {formatAddress(txDetails.to)}
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(txDetails.to)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Value & Gas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {t("transaction.value")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {txDetails.value} {currentNetwork.symbol}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        $
                        {txDetails.valueUsd.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Fuel className="h-4 w-4" />
                        {t("transaction.gasFee")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {txDetails.gasFee} {currentNetwork.symbol}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${txDetails.gasFeeUsd.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t("transaction.additionalInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Box className="h-3 w-3" />
                          {t("transaction.blockNumber")}
                        </p>
                        <p className="font-semibold">
                          {txDetails.blockNumber.toLocaleString()}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t("transaction.timestamp")}
                        </p>
                        <p className="font-semibold text-sm">
                          {formatDate(txDetails.timestamp)}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">
                          {t("transaction.gasUsed")}
                        </p>
                        <p className="font-semibold">
                          {parseInt(txDetails.gasUsed).toLocaleString()}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-1">
                          {t("transaction.gasPrice")}
                        </p>
                        <p className="font-semibold">
                          {txDetails.gasPrice} Gwei
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Explorer Link */}
                <div className="text-center">
                  <a
                    href={`${currentNetwork.explorer}/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    {t("transaction.viewOnExplorer")} ({currentNetwork.name})
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* Empty State */}
      {!hash && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">
              {t("transaction.emptyTitle")}
            </h3>
            <p className="text-muted-foreground">
              {t("transaction.emptyDescription")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionExplorer;
