import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ================================
// NEXTAUTH CONFIG
// ================================
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Custom pages — arahkan ke halaman login kita sendiri
  pages: {
    signIn: "/login",
  },

  // Callbacks — fungsi yang jalan di berbagai moment auth
  callbacks: {
    // Jalan setiap kali session dibaca
    // Kita tambahkan user id ke session supaya bisa dipakai di frontend
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },

    // Jalan setiap kali JWT token dibuat/diupdate
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },

  // Secret untuk enkripsi session
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Next.js App Router butuh export GET dan POST
export { handler as GET, handler as POST };