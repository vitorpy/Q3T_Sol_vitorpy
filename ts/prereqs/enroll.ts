import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Idl, Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
//import { IDL, WbaPrereq } from "./programs/wba_prereq";
import idl from './programs/wba_prereq.json';
import wallet from "./wba-wallet.json";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Github account
const github = Buffer.from("vitorpy", "utf8");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Create our program
const program: Program = new Program(idl as Idl, provider);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];

const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId,
);

console.log(`Enrollment account: ${enrollment_key.toBase58()}`);

// Execute our enrollment transaction
(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
      }, )
      .signers([keypair])
      .rpc();
    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
