import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        const image = "https://arweave.net/uAVT_Dn3VSghyCvCAs6vV-L32RpQa-OgDtKWm-QjYeI";
        const metadata = {
            name: "Generug",
            symbol: "RUG",
            image,
            attributes: {
                trait_type: "Background",
                value: "Red",
            },
            properties: {
                files: [
                    {
                        uri: image,
                        type: "image/png"
                    }
                ]
            },
            creators: [],
        }

        const jsonUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", jsonUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
