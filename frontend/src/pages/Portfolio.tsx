import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useCryptoData } from "@/hooks/useCryptoData";
import { formatPrice, formatPercentage } from "@/lib/cryptoData";
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Holding {
  coinId: string;
  amount: number;
  buyPrice: number;
}

const Portfolio = () => {
  usePageTitle("title.portfolio");
  const { t } = useLanguage();
  const { data: cryptocurrencies, isLoading } = useCryptoData();

  // Load holdings from localStorage
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    const saved = localStorage.getItem("portfolio-holdings");
    return saved ? JSON.parse(saved) : [];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHolding, setNewHolding] = useState({
    coinId: "",
    amount: "",
    buyPrice: "",
  });

  // Save holdings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("portfolio-holdings", JSON.stringify(holdings));
  }, [holdings]);

  const getCoinData = (coinId: string) =>
    cryptocurrencies?.find((c) => c.id === coinId);

  const calculatePortfolioValue = () => {
    return holdings.reduce((total, holding) => {
      const coin = getCoinData(holding.coinId);
      if (coin) {
        return total + coin.price * holding.amount;
      }
      return total;
    }, 0);
  };

  const calculatePortfolioChange = () => {
    let totalValue = 0;
    let totalCost = 0;

    holdings.forEach((holding) => {
      const coin = getCoinData(holding.coinId);
      if (coin) {
        totalValue += coin.price * holding.amount;
        totalCost += holding.buyPrice * holding.amount;
      }
    });

    if (totalCost === 0) return 0;
    return ((totalValue - totalCost) / totalCost) * 100;
  };

  const addHolding = () => {
    if (newHolding.coinId && newHolding.amount && newHolding.buyPrice) {
      setHoldings([
        ...holdings,
        {
          coinId: newHolding.coinId,
          amount: parseFloat(newHolding.amount),
          buyPrice: parseFloat(newHolding.buyPrice),
        },
      ]);
      setNewHolding({ coinId: "", amount: "", buyPrice: "" });
      setIsDialogOpen(false);
    }
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const portfolioValue = calculatePortfolioValue();
  const portfolioChange = calculatePortfolioChange();

  if (isLoading) {
    return (
      <div className="page-container flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("portfolio.title")}
        </h1>
        <p className="text-muted-foreground">{t("portfolio.subtitle")}</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flat-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("portfolio.totalValue")}
              </p>
              <p className="text-2xl font-bold">
                {formatPrice(portfolioValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="flat-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                portfolioChange >= 0 ? "bg-success/10" : "bg-destructive/10"
              }`}
            >
              {portfolioChange >= 0 ? (
                <TrendingUp className="w-6 h-6 text-success" />
              ) : (
                <TrendingDown className="w-6 h-6 text-destructive" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("portfolio.totalChange")}
              </p>
              <p
                className={`text-2xl font-bold ${
                  portfolioChange >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {formatPercentage(portfolioChange)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Holdings */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title mb-0">{t("portfolio.holdings")}</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flat-button">
                <Plus className="w-4 h-4 me-2" />
                {t("portfolio.addAsset")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("portfolio.addAsset")}</DialogTitle>
                <DialogDescription>
                  {t("portfolio.addAssetDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t("portfolio.coin")}</Label>
                  <Select
                    value={newHolding.coinId}
                    onValueChange={(value) =>
                      setNewHolding({ ...newHolding, coinId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("portfolio.selectCoin")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptocurrencies?.map((coin) => (
                        <SelectItem key={coin.id} value={coin.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-5 h-5 rounded-full"
                            />
                            {coin.name} ({coin.symbol})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("portfolio.amount")}</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newHolding.amount}
                    onChange={(e) =>
                      setNewHolding({ ...newHolding, amount: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("portfolio.buyPrice")}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newHolding.buyPrice}
                    onChange={(e) =>
                      setNewHolding({ ...newHolding, buyPrice: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <Button onClick={addHolding} className="w-full flat-button">
                  {t("common.save")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {holdings.length === 0 ? (
          <div className="flat-card p-12 text-center">
            <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t("portfolio.noAssets")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {holdings.map((holding, index) => {
              const coin = getCoinData(holding.coinId);
              if (!coin) return null;

              const currentValue = coin.price * holding.amount;
              const costBasis = holding.buyPrice * holding.amount;
              const profitLoss = currentValue - costBasis;
              const profitLossPercent =
                ((currentValue - costBasis) / costBasis) * 100;

              return (
                <div
                  key={index}
                  className="flat-card p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold">{coin.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {holding.amount} {coin.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-end">
                        <p className="text-sm text-muted-foreground">
                          {t("portfolio.value")}
                        </p>
                        <p className="font-bold">{formatPrice(currentValue)}</p>
                      </div>

                      <div className="text-end">
                        <p className="text-sm text-muted-foreground">
                          {t("portfolio.pl")}
                        </p>
                        <p
                          className={`font-bold ${
                            profitLoss >= 0
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {profitLoss >= 0 ? "+" : ""}
                          {formatPrice(profitLoss)} (
                          {formatPercentage(profitLossPercent)})
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHolding(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
