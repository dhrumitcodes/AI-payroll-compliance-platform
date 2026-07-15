import Layout from "../../components/layout/Layout";

function PayrollPage() {

    return (

        <Layout>

            <h1 className="text-4xl font-bold mb-6">
                Payroll Management
            </h1>

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex justify-between mb-6">

                    <h2 className="text-2xl font-semibold">
                        Payroll
                    </h2>

                    <button className="bg-red-600 text-white px-5 py-2 rounded-lg">
                        Generate Payroll
                    </button>

                </div>

                <table className="w-full">

                    <thead>

                    <tr>

                        <th className="text-left py-3">Employee</th>
                        <th className="text-left">Month</th>
                        <th className="text-left">Net Salary</th>

                    </tr>

                    </thead>

                    <tbody>

                    <tr>

                        <td className="py-4">Dhruv</td>
                        <td>July</td>
                        <td>₹50,000</td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </Layout>

    );

}

export default PayrollPage;