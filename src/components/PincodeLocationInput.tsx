import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface PincodeLocationInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

const PincodeLocationInput = ({ label, placeholder, value, onChange }: PincodeLocationInputProps) => {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLocation = async (code: string) => {
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();
      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const location = `${po.Name}, ${po.District}, ${po.State} - ${code}`;
        onChange(location);
      } else {
        setError("Invalid pincode");
      }
    } catch {
      setError("Failed to fetch location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <div className="relative w-36">
          <Input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPincode(val);
              if (val.length === 6) fetchLocation(val);
            }}
            placeholder="Pincode"
          />
          {loading && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <Input
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Address will auto-fill from pincode"}
          className="flex-1"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default PincodeLocationInput;
