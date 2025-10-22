using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SAAMSONSDISTRIBUTORS.Migrations
{
    /// <inheritdoc />
    public partial class Add_Selling_Price : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "SellingPriceAtTime",
                table: "Sales",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SellingPriceAtTime",
                table: "Deliveries",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SellingPriceAtTime",
                table: "Carts",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SellingPriceAtTime",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "SellingPriceAtTime",
                table: "Deliveries");

            migrationBuilder.DropColumn(
                name: "SellingPriceAtTime",
                table: "Carts");
        }
    }
}
